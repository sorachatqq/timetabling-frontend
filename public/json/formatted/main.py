import json
from docx import Document
from datetime import datetime

doc = Document("ตารางสอบ_M-2-2566.docx")
exam_data = {"exams": {"exam": []}}
instructors_data = {"instructors": {"instructor": []}}
instructor_id = 1
instructor_to_exams = {}
exam_id = 1

for table in doc.tables:
    for row in table.rows[1:]:
        cells = row.cells
        if len(cells) >= 7:
            room_id = cells[5].text.strip()
            if room_id:
                exam = {
                    "id": str(exam_id),
                    "name": cells[1].text.strip(),
                    "length": "120",
                    "alt": "true",
                    "printOffset": "0",
                    "average": cells[6].text.strip(),
                    "period": [],
                    "room": [{"id": room_id}]
                }
                exam_data["exams"]["exam"].append(exam)
                
                instructor_name = cells[4].text.strip()
                if instructor_name not in instructor_to_exams:
                    instructor_to_exams[instructor_name] = {"id": str(instructor_id), "exam": []}
                    instructor_id += 1
                instructor_to_exams[instructor_name]["exam"].append({"id": str(exam_id)})
                
                exam_id += 1

for instructor in instructor_to_exams.values():
    instructors_data["instructors"]["instructor"].append(instructor)

with open("rooms.json", "r", encoding="utf-8") as file:
    rooms_data = json.load(file)

room_name_to_id = {room["name"]: room["id"] for room in rooms_data["rooms"]["room"]}

for exam in exam_data["exams"]["exam"]:
    room_name = exam["room"][0]["id"]
    if room_name in room_name_to_id:
        exam["room"][0]["id"] = room_name_to_id[room_name]

current_time = datetime.now().strftime("%Y%m%d%H%M%S")
exam_filename = f"exam_data_{current_time}.json"
instructors_filename = f"instructors_data_{current_time}.json"
instructors_filename_update = f"instructors_data_{current_time}_update.json"

with open(exam_filename, "w", encoding="utf-8") as json_file:
    json.dump(exam_data, json_file, ensure_ascii=False, indent=4)
print(f"JSON file updated: {exam_filename}")

with open(instructors_filename, "w", encoding="utf-8") as json_file:
    json.dump(instructors_data, json_file, ensure_ascii=False, indent=4)
print(f"JSON file created: {instructors_filename}")

with open(instructors_filename, "r", encoding="utf-8") as file:
    instructors_data = json.load(file)

for instructor in instructors_data["instructors"]["instructor"]:
    instructor["exam"] = [exam for exam in instructor["exam"] if exam["id"]]

with open(instructors_filename_update, "w", encoding="utf-8") as json_file:
    json.dump(instructors_data, json_file, ensure_ascii=False, indent=4)

print("JSON file updated: instructors_data_updated.json")
