from sqlalchemy import inspect, select, text
from sqlalchemy.exc import IntegrityError
from sqlalchemy.orm import Session, sessionmaker

from app.db import create_engine_from_url, init_db
from app.models import Dataset, Prediction


def _session_for_tmp_db(tmp_path):
    db_file = tmp_path / "phase2-test.db"
    engine = create_engine_from_url(f"sqlite:///{db_file.as_posix()}")
    init_db(bind=engine)
    factory = sessionmaker(bind=engine, autocommit=False, autoflush=False, class_=Session)
    return engine, factory


def test_init_db_creates_prediction_and_dataset_tables(tmp_path) -> None:
    engine, _factory = _session_for_tmp_db(tmp_path)
    table_names = set(inspect(engine).get_table_names())
    assert "predictions" in table_names
    assert "datasets" in table_names
    engine.dispose()


def test_init_db_does_not_destroy_existing_rows(tmp_path) -> None:
    engine, factory = _session_for_tmp_db(tmp_path)
    with factory() as session:
        session.add(
            Prediction(
                input_json={"serviceName": "Keep Me"},
                efficiency_score=None,
            )
        )
        session.commit()

    init_db(bind=engine)

    with factory() as session:
        rows = session.scalars(select(Prediction)).all()
        assert len(rows) == 1
        assert rows[0].input_json["serviceName"] == "Keep Me"
    engine.dispose()


def test_create_and_retrieve_prediction(tmp_path) -> None:
    engine, factory = _session_for_tmp_db(tmp_path)
    payload = {
        "serviceSector": "Healthcare",
        "serviceName": "City Hospital",
        "citizenSatisfaction": 84,
    }
    with factory() as session:
        record = Prediction(
            input_json=payload,
            efficiency_score=None,
            model_name=None,
            model_version=None,
        )
        session.add(record)
        session.commit()
        session.refresh(record)
        saved_id = record.id
        assert saved_id
        assert record.created_at is not None

    with factory() as session:
        loaded = session.get(Prediction, saved_id)
        assert loaded is not None
        assert loaded.input_json == payload
        assert loaded.efficiency_score is None
        assert loaded.model_name is None
        assert loaded.model_version is None
    engine.dispose()


def test_prediction_can_store_score_and_model_metadata(tmp_path) -> None:
    engine, factory = _session_for_tmp_db(tmp_path)
    with factory() as session:
        record = Prediction(
            input_json={"serviceName": "Clinic"},
            efficiency_score=81.5,
            model_name="Linear Regression",
            model_version="1",
        )
        session.add(record)
        session.commit()
        session.refresh(record)
        assert record.efficiency_score == 81.5
        assert record.model_name == "Linear Regression"
        assert record.model_version == "1"
    engine.dispose()


def test_create_and_retrieve_dataset_metadata_without_file_bytes(tmp_path) -> None:
    engine, factory = _session_for_tmp_db(tmp_path)
    with factory() as session:
        dataset = Dataset(
            original_filename="services.csv",
            file_type="csv",
            analysis_status="pending",
        )
        session.add(dataset)
        session.commit()
        session.refresh(dataset)
        saved_id = dataset.id
        assert dataset.row_count is None
        assert dataset.column_names is None
        assert "file_content" not in dataset.__mapper__.columns
        assert "content" not in dataset.__mapper__.columns

    with factory() as session:
        loaded = session.get(Dataset, saved_id)
        assert loaded is not None
        assert loaded.original_filename == "services.csv"
        assert loaded.file_type == "csv"
        assert loaded.analysis_status == "pending"
        assert loaded.uploaded_at is not None

        loaded.row_count = 12
        loaded.column_names = ["sector", "satisfaction"]
        loaded.analysis_status = "analyzed"
        session.commit()

    with factory() as session:
        updated = session.get(Dataset, saved_id)
        assert updated is not None
        assert updated.row_count == 12
        assert updated.column_names == ["sector", "satisfaction"]
        assert updated.analysis_status == "analyzed"
    engine.dispose()


def test_dataset_rejects_invalid_file_type(tmp_path) -> None:
    engine, factory = _session_for_tmp_db(tmp_path)
    with factory() as session:
        session.add(
            Dataset(
                original_filename="virus.exe",
                file_type="exe",
                analysis_status="pending",
            )
        )
        try:
            session.commit()
            raise AssertionError("Expected IntegrityError for invalid file_type")
        except IntegrityError:
            session.rollback()
    engine.dispose()


def test_dataset_rejects_invalid_analysis_status(tmp_path) -> None:
    engine, factory = _session_for_tmp_db(tmp_path)
    with factory() as session:
        session.add(
            Dataset(
                original_filename="services.csv",
                file_type="csv",
                analysis_status="invented",
            )
        )
        try:
            session.commit()
            raise AssertionError("Expected IntegrityError for invalid analysis_status")
        except IntegrityError:
            session.rollback()
    engine.dispose()


def test_sqlite_schema_has_no_blob_file_columns(tmp_path) -> None:
    engine, _factory = _session_for_tmp_db(tmp_path)
    with engine.connect() as connection:
        dataset_cols = connection.execute(text("PRAGMA table_info(datasets)")).all()
        prediction_cols = connection.execute(text("PRAGMA table_info(predictions)")).all()
    column_names = {row[1] for row in dataset_cols} | {row[1] for row in prediction_cols}
    assert "file_bytes" not in column_names
    assert "file_content" not in column_names
    assert "content" not in column_names
    engine.dispose()
