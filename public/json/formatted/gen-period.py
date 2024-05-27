from datetime import datetime, timedelta
import json

# กำหนดช่วงเวลาและเวลาสอบ
start_date = datetime.strptime("25/02/2023", "%d/%m/%Y")
end_date = datetime.strptime("04/03/2023", "%d/%m/%Y")
exam_times = ["9:00a - 11:00a", "12:00p - 2:00p", "2:30p - 4:30p"]

# สร้างข้อมูล periods
periods = {"periods": {"period": []}}
period_id = 1

current_date = start_date
while current_date <= end_date:
    for exam_time in exam_times:
        period = {
            "id": str(period_id),
            "length": "120",
            "day": current_date.strftime("%a %m/%d"),
            "time": exam_time,
            "penalty": "0"
        }
        periods["periods"]["period"].append(period)
        period_id += 1
    current_date += timedelta(days=1)

# แปลงข้อมูลเป็น JSON และบันทึกลงไฟล์
json_data = json.dumps(periods, ensure_ascii=False, indent=4)
with open("periods.json", "w", encoding="utf-8") as json_file:
    json_file.write(json_data)

print("JSON file created: periods.json")
