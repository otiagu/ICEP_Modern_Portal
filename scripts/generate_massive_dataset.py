import os
import json
import random
import urllib.request
import time

# --- CONFIGURATION ---
NUM_STUDENT_IMAGES = 25
NUM_STAFF_IMAGES = 10
NUM_COORD_IMAGES = 5
IMG_DIR = r"C:\ICEPNET\ICEP_Modern\images"
JS_FILE = r"C:\ICEPNET\ICEP_Modern\data\icep_dataset.js"

if not os.path.exists(IMG_DIR):
    os.makedirs(IMG_DIR)

# --- FACULTIES & DEPARTMENTS ---
FACULTIES = {
    "Management Sciences": ["Accountancy", "Management", "Marketing", "Hospitality & Tourism Management", "Banking and Finance", "Insurance"],
    "Social Sciences": ["Economics", "Sociology", "Political Science", "Psychology", "Mass Communication", "Govt. & Public Admin.", "Library Sc."],
    "Physical Science": ["Computer Science"],
    "Humanities": ["History & International Studies", "English and Literary Studies", "Philosophy"],
    "Education": ["Edu/Accountancy", "Edu/Economics", "Edu/English", "Edu/Govt", "Edu/Biology", "Edu/Religion", "Edu/Igbo", "Edu/Guidance & Counseling"]
}

LEVELS = [100, 200, 300, 400]

# Generate unique names
FIRST_NAMES_M = ["Emmanuel", "Chukwudi", "Tunde", "Farouk", "Ibrahim", "Obinna", "Adebayo", "Suleiman", "Emeka", "Chinedu", "Musa", "Abubakar", "Olumide", "Nnamdi", "Babatunde", "Yusuf", "Kehinde", "Kolawole"]
FIRST_NAMES_F = ["Adaeze", "Ifeoma", "Yetunde", "Zainab", "Fatima", "Amaka", "Chioma", "Aisha", "Binta", "Ngozi", "Oluwaseun", "Blessing", "Joy", "Halima", "Chika", "Mary", "Folashade"]
LAST_NAMES = ["Okafor", "Nwosu", "Bello", "Eze", "Balogun", "Aliyu", "Opara", "Sowore", "Adeyemi", "Okeke", "Abubakar", "Ibrahim", "Ogunleye", "Chukwu", "Igwe", "Kalu", "Danladi"]

def generate_name(is_female=None):
    if is_female is None:
        is_female = random.choice([True, False])
    first = random.choice(FIRST_NAMES_F) if is_female else random.choice(FIRST_NAMES_M)
    last = random.choice(LAST_NAMES)
    return f"{first} {last}"

# --- IMAGE DOWNLOADER ---
print("Downloading 40 realistic images from pravatar.cc...")
student_imgs = []
staff_imgs = []
coord_imgs = []

# pravatar.cc IDs (1 to 70 are guaranteed to exist)
used_ids = set()
def get_unique_pravatar_id():
    while True:
        pid = random.randint(1, 70)
        if pid not in used_ids:
            used_ids.add(pid)
            return pid

def download_images(prefix, count):
    paths = []
    for i in range(1, count + 1):
        filename = f"{prefix}_{i:02d}.jpg"
        filepath = os.path.join(IMG_DIR, filename)
        paths.append(f"images/{filename}")
        if not os.path.exists(filepath):
            pid = get_unique_pravatar_id()
            url = f"https://i.pravatar.cc/300?img={pid}"
            try:
                urllib.request.urlretrieve(url, filepath)
                print(f"  -> Downloaded {filename}")
                time.sleep(0.5) # Prevent rate limiting
            except Exception as e:
                print(f"  -> Failed to download {filename}: {e}")
                # Fallback to ui-avatars
                paths[-1] = f"https://ui-avatars.com/api/?name=Avatar+{i}&size=200&background=random&color=fff"
    return paths

student_imgs = download_images("synthetic_student", NUM_STUDENT_IMAGES)
staff_imgs = download_images("synthetic_staff", NUM_STAFF_IMAGES)
coord_imgs = download_images("synthetic_coord", NUM_COORD_IMAGES)

# --- GENERATE DATA ---
print("Generating massive dataset...")

faculties_data = []
depts_data = []
students_data = []
coordinators_data = []
course_reps_data = []
lecturers_data = []

fac_id_counter = 1
student_id_counter = 1

for fac_name, depts in FACULTIES.items():
    fac_obj = {
        "id": f"FAC-{fac_id_counter:03d}",
        "name": fac_name,
        "dean": "Prof. " + generate_name(),
        "departments": depts,
        "total_students": 0,
        "total_staff": len(depts) * 4,
        "building": f"{fac_name} Complex"
    }
    faculties_data.append(fac_obj)
    
    # Generate 1 Coordinator for this faculty
    coord = {
        "id": f"COORD-{fac_id_counter}",
        "name": "Dr. " + generate_name(),
        "faculty": fac_name,
        "avatar": random.choice(coord_imgs)
    }
    coordinators_data.append(coord)
    
    for dept_name in depts:
        depts_data.append({
            "name": dept_name,
            "faculty": fac_name,
            "hod": "Dr. " + generate_name()
        })
        
        # Generate 4 lecturers for this department
        for l in range(4):
            lecturers_data.append({
                "id": f"LEC-{fac_id_counter}-{dept_name[:3].upper()}-{l}",
                "name": ("Prof. " if l==0 else "Dr. ") + generate_name(),
                "department": dept_name,
                "faculty": fac_name,
                "avatar": random.choice(staff_imgs)
            })
        
        # Generate Students
        for level in LEVELS:
            if fac_name in ["Humanities", "Education"]:
                num_students = random.randint(6, 18)
            else:
                num_students = random.randint(16, 30)
                
            fac_obj["total_students"] += num_students
            
            # 1 Course Rep per level
            rep_assigned = False
            
            for i in range(num_students):
                stu_name = generate_name()
                matric = f"2026/{dept_name[:3].upper()}/{student_id_counter:04d}"
                is_paid = random.choice(["PAID", "PAID", "PAID", "UNPAID"])
                stu = {
                    "id": student_id_counter,
                    "name": stu_name,
                    "matric": matric,
                    "department": dept_name,
                    "faculty": fac_name,
                    "level": level,
                    "avatar": random.choice(student_imgs),
                    "cgpa": f"{random.uniform(2.5, 4.9):.2f}",
                    "attendance": f"{random.randint(60, 100)}%",
                    "dues": is_paid,
                    "track": random.choice(["Core", "Specialized", "General"]),
                    "advisor": random.choice(lecturers_data[-4:])["name"]
                }
                students_data.append(stu)
                student_id_counter += 1
                
                # Assign 1 rep per level in every department as requested
                if not rep_assigned:
                    course_reps_data.append({
                        "id": f"REP-{dept_name[:3]}-{level}",
                        "name": stu_name,
                        "matric": matric,
                        "department": dept_name,
                        "faculty": fac_name,
                        "level": level,
                        "avatar": stu["avatar"]
                    })
                    rep_assigned = True

    fac_id_counter += 1

# Generate a Timetable
timetable_data = []
days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"]
for dept in depts_data:
    dept_name = dept["name"]
    dept_lecturers = [l for l in lecturers_data if l["department"] == dept_name]
    if not dept_lecturers: continue
    
    # 2 classes per day for this dept
    for day in days:
        for _ in range(2):
            code = f"{dept_name[:3].upper()} {random.choice([101, 102, 201, 202, 301, 302, 401, 402])}"
            timetable_data.append({
                "day": day,
                "courseCode": code,
                "courseTitle": f"Topics in {dept_name}",
                "startTime": "09:00",
                "endTime": "11:00",
                "venue": f"Hall {random.randint(1,10)}",
                "lecturer": random.choice(dept_lecturers)["name"]
            })

# Write to icep_dataset.js
print("Writing to icep_dataset.js...")

js_content = f"""// AUTO-GENERATED MASSIVE DATASET FOR ICEP
// Contains {len(students_data)} Students, {len(coordinators_data)} Coordinators, {len(course_reps_data)} Course Reps, {len(lecturers_data)} Lecturers.

window.ALLOW_CROSS_TENANT_TESTING = false;

const ICEP_FACULTIES = {json.dumps(faculties_data, indent=2)};
const ICEP_DEPARTMENTS = {json.dumps(depts_data, indent=2)};
const ICEP_COORDINATORS = {json.dumps(coordinators_data, indent=2)};
const ICEP_COURSE_REPS = {json.dumps(course_reps_data, indent=2)};
const ICEP_STUDENTS = {json.dumps(students_data, indent=2)};
const ICEP_LECTURERS = {json.dumps(lecturers_data, indent=2)};
const ICEP_TIMETABLE = {json.dumps(timetable_data, indent=2)};

// Merging LocalStorage custom data (Agent 1 functionality)
try {{
    const customStudents = localStorage.getItem('ICEP_STUDENTS_CUSTOM');
    if (customStudents) {{
        const parsed = JSON.parse(customStudents);
        ICEP_STUDENTS.push(...parsed);
    }}
    const customTimetable = localStorage.getItem('ICEP_TIMETABLE_CUSTOM');
    if (customTimetable) {{
        const parsed = JSON.parse(customTimetable);
        ICEP_TIMETABLE.push(...parsed);
    }}
}} catch(e) {{
    console.error("Failed to load local storage data", e);
}}
"""

with open(JS_FILE, "w", encoding="utf-8") as f:
    f.write(js_content)

print(f"Successfully generated {len(students_data)} students!")
