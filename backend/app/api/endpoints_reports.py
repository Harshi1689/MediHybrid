"""
endpoints_reports.py
====================
Medical Report Scanner (OCR) & PDF Assessment Report Download Endpoints.
"""

from fastapi import APIRouter, UploadFile, File, Depends, HTTPException, Response
from fastapi.responses import FileResponse
from sqlalchemy.orm import Session
import os
from app.database import get_db
from app.models.db_models import Assessment
from app.services.ocr_service import report_scanner
from app.services.pdf_service import pdf_generator

router = APIRouter(prefix="/api/reports", tags=["Reports & OCR"])

@router.get("/academic-pdf")
def get_academic_report_pdf():
    pdf_path = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", "..", "..", "docs", "MediHybrid_Academic_Report.pdf"))
    if not os.path.exists(pdf_path):
        raise HTTPException(status_code=404, detail="Academic report PDF not found on server.")
    return FileResponse(
        pdf_path,
        media_type="application/pdf",
        filename="MediHybrid_Academic_Report_Amith_Harshith.pdf"
    )

@router.post("/extract")
async def extract_medical_report(file: UploadFile = File(...)):
    try:
        content = await file.read()
        res = report_scanner.scan_report(content, filename=file.filename)
        return res
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Report OCR extraction error: {str(e)}")

@router.get("/download/{record_id}")
def download_pdf_report(record_id: int, db: Session = Depends(get_db)):
    rec = db.query(Assessment).filter(Assessment.id == record_id).first()
    if not rec:
        raise HTTPException(status_code=404, detail=f"Assessment record #{record_id} not found.")

    payload = {
        "record_id": f"MH-{rec.id:05d}",
        "disease": "Diabetes Risk Assessment" if rec.assessment_type == "diabetes" else "Heart Disease Risk Assessment",
        "timestamp": rec.created_at.strftime("%Y-%m-%d %H:%M:%S"),
        "inputs": rec.input_values,
        "hybrid": {
            "score": rec.hybrid_score,
            "category": rec.risk_category,
            "recommendation": "Review this experimental soft-computing assessment with a certified healthcare practitioner."
        },
        "ann": {"score": rec.ann_score},
        "fuzzy": {"fuzzy_score": rec.fuzzy_score, "risk_level": rec.risk_category},
        "explainability": rec.explainability or []
    }

    try:
        pdf_bytes = pdf_generator.generate_assessment_pdf(payload)
        return Response(
            content=pdf_bytes,
            media_type="application/pdf",
            headers={"Content-Disposition": f"attachment; filename=MediHybrid_Report_MH_{rec.id:05d}.pdf"}
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"PDF generation failed: {str(e)}")
