import random
import uuid
from datetime import date
from typing import Optional
from fastapi import FastAPI, HTTPException, Body, Query
from databases import Database
from pydantic import BaseModel
from fastapi.responses import JSONResponse
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Database configurations
DATABASE_NAME = "TestDB"
CLIENT_TABLE_NAME = "Client"
CLIENT_RECORDS_TABLE_NAME = "ClientRecord"
PAYMENT_TABLE_NAME = "Payment"
DATABASE_URL = "mysql://admin:admin1234@testdb.c7jfeg3symat.us-east-2.rds.amazonaws.com:3306/" + DATABASE_NAME
database = Database(DATABASE_URL)


# Pydantic models
class Client(BaseModel):
    Client_id: str
    ClientName: str


class ClientRecord(BaseModel):
    RecordId: int
    Client_id: str
    LoanMaturity: str
    LoanAmount: float
    InterestRate: float
    ActiveStatus: bool
    PaymentFrequency: str
    ClientName: str


class NewRecord(BaseModel):
    ClientName: str
    PaymentFrequency: str
    LoanMaturity: str
    LoanAmount: float
    InterestRate: float
    ActiveStatus: bool


class UpdateRecord(BaseModel):
    LoanMaturity: str
    LoanAmount: float
    ActiveStatus: bool


@app.put("/api/update-record")
async def update_record(record: UpdateRecord, record_id: int = Query(...)):
    query = f"""
    UPDATE {CLIENT_RECORDS_TABLE_NAME}
    SET LoanMaturity = :LoanMaturity,
        LoanAmount = :LoanAmount,
        ActiveStatus = :ActiveStatus
    WHERE RecordId = :record_id
    """

    values = {
        "record_id": record_id,
        "LoanMaturity": record.LoanMaturity,
        "LoanAmount": record.LoanAmount,
        "ActiveStatus": record.ActiveStatus,
    }

    try:
        await database.execute(query, values)
        return JSONResponse(content={"message": "Record updated successfully"}, status_code=200)
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))


@app.get("/api/clients")
async def get_all_clients():
    query = f"SELECT * FROM {CLIENT_TABLE_NAME}"
    result = await database.fetch_all(query)
    records = [Client(**row).model_dump() for row in result]
    return JSONResponse(content={"results": records}, status_code=200)


@app.get("/api/search-by-client-id")
async def search_by_client_id(client_id: str = None):
    if client_id == "*":
        query = f"SELECT * FROM {CLIENT_RECORDS_TABLE_NAME}"
        result = await database.fetch_all(query)
    else:
        query = f"""
            SELECT * FROM {CLIENT_RECORDS_TABLE_NAME}
            WHERE Client_id = :client_id
        """
        values = {"client_id": client_id}
        result = await database.fetch_all(query, values=values)

    # Convert each ClientRecord object to a dictionary
    records = [ClientRecord(**row).model_dump() for row in result]
    return JSONResponse(content={"results": records}, status_code=200)

@app.get("/api/search-by-record-id")
async def search_by_client_id(record_id: str = None):

    query = f"""
            SELECT * FROM {CLIENT_RECORDS_TABLE_NAME}
            WHERE RecordId = :record_id
        """
    values = {"record_id": record_id}
    result = await database.fetch_all(query, values=values)

    # Convert each ClientRecord object to a dictionary
    records = [ClientRecord(**row).model_dump() for row in result]
    return JSONResponse(content={"results": records}, status_code=200)


@app.post("/api/new-record")
async def create_new_record(record: NewRecord):
    # Generate a random 6-digit RecordId
    record_id = random.randint(100000, 999999)

    # ... existing code ...

    # Find the Client_id using the provided client name
    find_client_query = f"""
    SELECT Client_id FROM {CLIENT_TABLE_NAME}
    WHERE ClientName = :client_name
    """
    client = await database.fetch_one(find_client_query, {"client_name": record.ClientName})

    # If client not found, create a new client
    if not client:
        new_client_id = str(uuid.uuid4())
        create_client_query = f"""
        INSERT INTO {CLIENT_TABLE_NAME} (Client_id, ClientName)
        VALUES (:client_id, :client_name)
        """
        await database.execute(create_client_query,
                               {"client_id": new_client_id, "client_name": record.ClientName})
        client_id = new_client_id
    else:
        client_id = client["Client_id"]

    # Insert the new record
    insert_query = f"""
    INSERT INTO {CLIENT_RECORDS_TABLE_NAME} (RecordId, Client_id, LoanAmount, ActiveStatus, LoanMaturity, ClientName, PaymentFrequency, InterestRate)
    VALUES (:record_id, :client_id, :loan_amount, :active_status, :loan_maturity, :name, :payment_frequency, :interest_rate)
    """
    await database.execute(insert_query, {
        "record_id": record_id,
        "client_id": client_id,
        "loan_amount": record.LoanAmount,
        "active_status": record.ActiveStatus,
        "loan_maturity": record.LoanMaturity,
        "name": record.ClientName,
        "payment_frequency": record.PaymentFrequency,
        "interest_rate": record.InterestRate
    })
    return JSONResponse(content={"message": "New record created successfully", "RecordId": record_id}, status_code=200)


async def create_tables():
    query = f"""
    CREATE DATABASE IF NOT EXISTS {DATABASE_NAME};
    CREATE TABLE IF NOT EXISTS {CLIENT_TABLE_NAME} (
        Client_id VARCHAR(50) PRIMARY KEY,
        ClientName VARCHAR(50)
    );

    CREATE TABLE IF NOT EXISTS {CLIENT_RECORDS_TABLE_NAME} (
        RecordId INT PRIMARY KEY,
        Client_id VARCHAR(50),
        LoanAmount DECIMAL(10, 2),
        ActiveStatus BOOLEAN,
        ClientName VARCHAR(50),
        LoanMaturity VARCHAR(50),
        PaymentFrequency VARCHAR(50),
        InterestRate DECIMAL(10, 4),
        FOREIGN KEY (Client_id) REFERENCES {CLIENT_TABLE_NAME}(Client_id)
    );
    """
    await database.execute(query)


@app.on_event("startup")
async def startup():
    await database.connect()
    await create_tables()


@app.on_event("shutdown")
async def shutdown():
    await database.disconnect()


@app.get("/heartbeat")
async def heartbeat():
    return JSONResponse(content={"success": True}, status_code=200)


if __name__ == "__main__":
    import uvicorn

    uvicorn.run(app, host="0.0.0.0", port=8000)
