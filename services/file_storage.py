import os
import random
import uuid
from dataclasses import dataclass, field, asdict
from typing import Dict, Optional, Tuple, Any, List

class MockFileStorage:
    """Simulated file upload handler. Stores uploaded files locally."""
    def __init__(self, base_dir="output/uploads"):
        self.base_dir = base_dir
        os.makedirs(self.base_dir, exist_ok=True)

    def upload(self, customer_phone: str, filename: str, content: bytes) -> str:
        uid = str(uuid.uuid4())[:8]
        dest = os.path.join(self.base_dir, f"{customer_phone}_{uid}_{filename}")
        with open(dest, "wb") as f:
            f.write(content)
        return dest