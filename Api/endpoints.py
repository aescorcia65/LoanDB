import decimal
import json
from datetime import datetime, timedelta, date
from typing import List

from dateutil.relativedelta import relativedelta
import random
import uuid
from decimal import Decimal

from databases import Database
from fastapi import FastAPI, Query
from fastapi.responses import JSONResponse
from fastapi.middleware.cors import CORSMiddleware

from models import NewLoan, NewPayment, Client, Loan, Payment, UpdateLoan, FilterParams, NewClient

DATABASE_NAME = "LMS"
CLIENT_TABLE_NAME = "Client"
CLIENT_RECORDS_TABLE_NAME = "LoanRecord"
PAYMENT_TABLE_NAME = "PaymentRecord"
DATABASE_URL = "mysql://admin:admin1234@testdb.c7jfeg3symat.us-east-2.rds.amazonaws.com:3306/" + DATABASE_NAME
database = Database(DATABASE_URL)

app = FastAPI()
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


async def new_client(clientName):
    find_client_query = f"""
        SELECT * FROM {CLIENT_TABLE_NAME}
        WHERE ClientName = :ClientName
        """
    client_check = await database.fetch_one(find_client_query, {"ClientName": clientName})

        # If client not found, create a new client
    if not client_check:
       new_client_id = str(uuid.uuid4())
       create_client_query = f"""
       INSERT INTO {CLIENT_TABLE_NAME} (ClientId, ClientName)
       VALUES (:ClientId, :ClientName)
       """
       await database.execute(create_client_query,{"ClientId": new_client_id, "ClientName": clientName})
       client_id = new_client_id
       return client_id
    else:
        return client_check.ClientId

@app.get("/api/clients")
async def get_all_clients():
    query = f"SELECT * FROM {CLIENT_TABLE_NAME}"
    result = await database.fetch_all(query)
    records = [Client(**row).model_dump() for row in result]
    return JSONResponse(content={"results": records}, status_code=200)

@app.post("/api/new-loan")
async def create_new_loan(loan: NewLoan):
    # Generate a random 6-digit RecordId
    record_id = random.randint(100000, 999999)
    record_id = "LX-"+str(record_id)
    if loan.Type == "New":
        client_id = await new_client(loan.Name)
    else:
        client_id = loan.ClientId


    insert_query = f"""
        INSERT INTO {CLIENT_RECORDS_TABLE_NAME} (LoanId, ClientId, LoanAmount, ActiveStatus, LoanLength, PaymentFrequency, InterestAmount, IssueDate)
        VALUES (:record_id, :client_id, :loan_amount, :active_status, :loan_length, :payment_frequency, :interest_amount, :issue_date)
        """
    await database.execute(insert_query, {
            "record_id": record_id,
            "client_id": client_id,
            "loan_amount": loan.LoanAmount,
            "active_status": 1,
            "loan_length": loan.LoanLength,
            "payment_frequency": loan.PaymentFrequency,
            "interest_amount": loan.InterestAmount,
            "issue_date": loan.IssueDate
        })
    return JSONResponse(content={"message": "New record created successfully", "LoanId": record_id}, status_code=200)

@app.post("/api/new-payment")
async def create_new_payment(payment: NewPayment):
    payment_id = str(uuid.uuid4())
    query = f"""
    INSERT INTO {PAYMENT_TABLE_NAME}
    (LoanId, PaymentDueDate, PaymentDueAmount, PaymentRecDate, PaymentRecAmount, PaymentId, PaidStatus)
    VALUES (:record_id, :payment_due_date, :payment_due_amount, :payment_rec_date, :payment_rec_amount, :payment_id, :paid_status)
    """
    values = {
        "record_id": payment.LoanId,
        "payment_due_date": payment.PaymentDueDate,
        "payment_due_amount": payment.PaymentDueAmount,
        "payment_rec_date": payment.PaymentRecDate,
        "payment_rec_amount": payment.PaymentRecAmount,
        "payment_id": payment_id,
        "paid_status": False
    }
    await database.execute(query, values)
    return {"message": "New payment created successfully", "PaymentId": payment_id}


@app.get("/api/search-by-client-id")
async def search_by_client_id(client_id: str = None):
    if client_id == "*":
        query = f"SELECT * FROM {CLIENT_RECORDS_TABLE_NAME}"
        result = await database.fetch_all(query)
    else:
        query = f"""
            SELECT * FROM {CLIENT_RECORDS_TABLE_NAME}
            WHERE ClientId = :client_id
        """
        values = {"client_id": client_id}
        result = await database.fetch_all(query, values=values)

    # Convert each ClientRecord object to a dictionary
    converted_rows = []
    for row in result:
        row_dict = dict(row)  # Convert row to dictionary
        converted_row = {
            key: (value.isoformat() if isinstance(value, date) else
                  float(value) if isinstance(value, Decimal) else
                  value)
            for key, value in row_dict.items()
        }
        converted_rows.append(converted_row)
    ##records = [Loan(**row).model_dump() for row in result]
    return JSONResponse(content={"results": converted_rows}, status_code=200)

@app.get("/api/search-by-loan-id")
async def search_by_loan_id(loan_id: str = None):

    query = f"""
            SELECT * FROM {CLIENT_RECORDS_TABLE_NAME}
            WHERE LoanId = :loan_id
        """
    values = {"loan_id": loan_id}
    result = await database.fetch_all(query, values=values)

    # Convert each ClientRecord object to a dictionary
    converted_rows = []
    for row in result:
        row_dict = dict(row)  # Convert row to dictionary
        converted_row = {
            key: (value.isoformat() if isinstance(value, date) else
                  float(value) if isinstance(value, Decimal) else
                  value)
            for key, value in row_dict.items()
        }
        converted_rows.append(converted_row)
    return {"results": converted_rows}


@app.get("/api/search-payments-by-loan-id")
async def search_payments_by_client_id(loan_id: str = None):
    query = f"""
            SELECT * FROM {PAYMENT_TABLE_NAME}
            WHERE LoanId = :loan_id
        """
    values = {"loan_id": loan_id}
    result = await database.fetch_all(query, values=values)

    # Convert each ClientRecord object to a dictionary
    converted_rows = []
    for row in result:
        row_dict = dict(row)  # Convert row to dictionary
        converted_row = {
            key: (value.isoformat() if isinstance(value, date) else
                  float(value) if isinstance(value, Decimal) else
                  value)
            for key, value in row_dict.items()
        }
        converted_rows.append(converted_row)
    return JSONResponse(content={"results": converted_rows}, status_code=200)

@app.put("/api/active-status")
async def update_record(record: UpdateLoan, loan_id: str = Query(...)):
    query = f"""
    UPDATE {CLIENT_RECORDS_TABLE_NAME}
    SET ActiveStatus = :ActiveStatus
    WHERE LoanId = :loan_id
    """

    values = {
        "loan_id": loan_id,
        "ActiveStatus": record.ActiveStatus,
    }

    await database.execute(query, values)
    return JSONResponse(content={"message": "Record updated successfully"}, status_code=200)



async def get_payment_by_paymentid(payment_id: str):
    query = f"""
        SELECT * FROM {PAYMENT_TABLE_NAME}
        WHERE PaymentId = :payment_id"""
    values = {"payment_id": payment_id}
    result = await database.fetch_all(query, values=values)
    converted_rows = []
    for row in result:
        row_dict = dict(row)
        converted_row = {
            key: value
            for key, value in row_dict.items()
        }
        converted_rows.append(converted_row)
        return converted_rows[0]

@app.put("/api/update-payment-status")
async def update_payment_status(payment_id: str = Query(...), paid_staus: bool = Query(...)):
    record = await get_payment_by_paymentid(payment_id)
    loan = await search_by_loan_id(record["LoanId"])
    loan = loan["results"][0]
    if record["PaidStatus"] == paid_staus:
        return JSONResponse(content={"message": "Payment Status is already updated"}, status_code=200)
    query = f"""
        UPDATE {PAYMENT_TABLE_NAME}
        SET PaidStatus = :paid_status
        WHERE PaymentId = :payment_id
        """

    values = {
        "payment_id": payment_id,
        "paid_status": paid_staus
    }

    await database.execute(query, values)
    if paid_staus == False:
        return "Status Updated"
    payfreq = loan["PaymentFrequency"]
    if payfreq == "Manual" or record["PaymentDueAmount"] == loan["LoanAmount"]:
        return "Status Updated"
    elif payfreq == "Monthly":
        date_format = "%Y-%m-%d"
        issue_date = datetime.strptime(loan["IssueDate"], date_format)
        loan_maturity = datetime.strptime(loan["LoanMaturity"], date_format)
        last_payment_date = record["PaymentDueDate"]
        if isinstance(last_payment_date, date) and not isinstance(last_payment_date, datetime):
            last_payment_date = datetime.combine(last_payment_date, datetime.min.time())
        print(issue_date)

        total_days = (loan_maturity - issue_date).days
        new_due_date = last_payment_date + timedelta(days=30)
        new_due_date = min(new_due_date, loan_maturity)
        print(new_due_date)
        amtpayments = total_days // 30
        dueamt = (loan["LoanAmount"] * (loan["InterestRate"] * .01)) / amtpayments
    elif payfreq == "Quarterly":
        date_format = "%Y-%m-%d"
        issue_date = datetime.strptime(loan["IssueDate"], date_format)
        loan_maturity = datetime.strptime(loan["LoanMaturity"], date_format)
        last_payment_date = record["PaymentDueDate"]
        if isinstance(last_payment_date, date) and not isinstance(last_payment_date, datetime):
            last_payment_date = datetime.combine(last_payment_date, datetime.min.time())

        total_days = (loan_maturity - issue_date).days
        new_due_date = last_payment_date + timedelta(days=90)
        new_due_date = min(new_due_date, loan_maturity)
        amtpayments = total_days // 90
        dueamt = (loan["LoanAmount"] * (loan["InterestRate"] * .01)) / amtpayments
    elif payfreq == "Annually":
        date_format = "%Y-%m-%d"
        issue_date = datetime.strptime(loan["IssueDate"], date_format)
        loan_maturity = datetime.strptime(loan["LoanMaturity"], date_format)
        last_payment_date = record["PaymentDueDate"]
        if isinstance(last_payment_date, date) and not isinstance(last_payment_date, datetime):
            last_payment_date = datetime.combine(last_payment_date, datetime.min.time())

        total_days = (loan_maturity - issue_date).days
        new_due_date = last_payment_date + relativedelta(years=1)
        new_due_date = min(new_due_date, loan_maturity)
        amtpayments = total_days // 365
        dueamt = (loan["LoanAmount"] * (loan["InterestRate"] * .01)) / amtpayments
    else:
        return
    if new_due_date == loan_maturity:
        dueamt = loan["LoanAmount"]
    new_payment = NewPayment(
        LoanId=loan["LoanId"],
        PaymentDueDate=new_due_date,
        PaymentDueAmount=dueamt
    )
    await create_new_payment(new_payment)


@app.put("/api/update-payment")
async def update_payment(record: Payment):
    print(record.PaymentRecDate)
    paid_status = record.PaidStatus
    payment_id = record.PaymentId
    test = await update_payment_status(payment_id, paid_status)
    query = f"""
                    UPDATE {PAYMENT_TABLE_NAME}
                    SET PaymentRecDate = :PaymentRecDate,
                        PaymentRecAmount = :PaymentRecAmount
                    WHERE PaymentId = :payment_id
                    """

    values = {
            "PaymentRecDate": record.PaymentRecDate,
            "PaymentRecAmount": record.PaymentRecAmount,
            "payment_id": payment_id
        }

    await database.execute(query, values)
    return JSONResponse(content={"message": "Record updated successfully"}, status_code=200)

@app.post("/api/filter-data")
async def filter_data(params: FilterParams):
    # SQL Query for MySQL
    if params.ActiveStatus == "both":
        active_status = [True, False]
    elif params.ActiveStatus == "closed":
        active_status = [False]
    elif params.ActiveStatus == "open":
        active_status = [True]
    else:
        active_status = ["none"]


    month_conditions = ", ".join(str(month) for month in params.Months)
    year_conditions = ", ".join(str(year) for year in params.Years)
    if params.ClientId == "*":
        query = f"""
            SELECT p.*, l.*
            FROM {PAYMENT_TABLE_NAME} AS p
            JOIN {CLIENT_RECORDS_TABLE_NAME} AS l ON p.LoanId = l.LoanId
            WHERE MONTH(p.PaymentDueDate) IN ({month_conditions})
            AND YEAR(p.PaymentDueDate) IN ({year_conditions})
            AND (p.PaidStatus IN :active_status)
            """

    # Execute query
        result = await database.fetch_all(query=query, values={
            "active_status": active_status
        })
    else:
        query = f"""
                    SELECT p.*, l.*
                    FROM {PAYMENT_TABLE_NAME} AS p
                    JOIN {CLIENT_RECORDS_TABLE_NAME} AS l ON p.LoanId = l.LoanId
                    WHERE MONTH(p.PaymentDueDate) IN ({month_conditions})
                    AND YEAR(p.PaymentDueDate) IN ({year_conditions})
                    AND (p.PaidStatus IN :active_status)
                    AND (l.ClientId) = :client_id
                    """

            # Execute query
        result = await database.fetch_all(query=query, values={
                    "active_status": active_status,
                    "client_id": params.ClientId
                })

    # Return result
    return {"results":result}

async def create_tables():
    query = f"""
    CREATE DATABASE IF NOT EXISTS {DATABASE_NAME};

    CREATE TABLE IF NOT EXISTS {CLIENT_TABLE_NAME} (
        ClientId VARCHAR(50) NOT NULL PRIMARY KEY,
        ClientName VARCHAR(50) NOT NULL
    );

    CREATE TABLE IF NOT EXISTS {CLIENT_RECORDS_TABLE_NAME} (
        LoanId VARCHAR(50) NOT NULL PRIMARY KEY,
        ClientId VARCHAR(50) NOT NULL,
        LoanAmount DECIMAL(10, 2) NOT NULL,
        ActiveStatus BOOLEAN NOT NULL,
        LoanLength INT NOT NULL,
        PaymentFrequency VARCHAR(50) NOT NULL,
        InterestAmount DECIMAL(10, 2),
        IssueDate DATE NOT NULL,
        FOREIGN KEY (ClientId) REFERENCES {CLIENT_TABLE_NAME}(ClientId)
    );

    CREATE TABLE IF NOT EXISTS {PAYMENT_TABLE_NAME} (
        LoanId VARCHAR(50) NOT NULL,
        PaymentDueDate DATE NOT NULL,
        PaymentDueAmount DECIMAL(10, 2) NOT NULL,
        PaymentRecDate DATE,
        PaymentRecAmount DECIMAL(10, 2),
        PaidStatus BOOLEAN NOT NULL,
        PaymentId VARCHAR(50) NOT NULL PRIMARY KEY,
        FOREIGN KEY (LoanId) REFERENCES {CLIENT_RECORDS_TABLE_NAME}(LoanId));
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