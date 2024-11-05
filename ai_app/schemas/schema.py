from typing import Optional

from pydantic import BaseModel, IPvAnyAddress

class BusinessURL(BaseModel):
    fileUrl: str
    fileKey: str

class UserText(BaseModel):
    message: str

class UserIP(BaseModel):
    userIp: Optional[IPvAnyAddress] = None