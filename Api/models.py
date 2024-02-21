from datetime import date
from typing import Optional, List

from pydantic import BaseModel


class Client(BaseModel):
    ClientId: str
    ClientName: str

class NewClient(BaseModel):
    ClientName: str

class Loan(BaseModel):
    LoanId: str
    ClientId: str
    LoanMaturity: date
    LoanAmount: float
    InterestRate: float
    ActiveStatus: bool
    PaymentFrequency: str
    ClientName: str
    IssueDate: date



class NewLoan(BaseModel):
    ClientId: str
    PaymentFrequency: str
    LoanLength: int
    LoanAmount: float
    InterestAmount: float
    IssueDate: date
    Name: str
    Type: str


class UpdateLoan(BaseModel):
    LoanID: Optional[str] = None
    ActiveStatus: bool

class Payment(BaseModel):
    LoanId: str
    PaymentDueDate: date
    PaymentDueAmount: float
    PaymentRecDate: Optional[date] = None
    PaymentRecAmount: Optional[float] = None
    PaymentId: Optional[str] = None
    PaidStatus: bool

class NewPayment(BaseModel):
    LoanId: str
    PaymentDueDate: date
    PaymentDueAmount: float
    PaymentRecDate: Optional[date] = None
    PaymentRecAmount: Optional[float] = None

class FilterParams(BaseModel):
    Months: List[int] = [0]
    Years: List[int] = [0]
    ActiveStatus: str
    ClientId: str