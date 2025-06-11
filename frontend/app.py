from flask import Flask, render_template, request, jsonify, redirect
import requests

app = Flask(__name__)

BACKEND_URL = "http://127.0.0.1:3000"

@app.route("/")
def root():
    return redirect("/login")

@app.route("/login", methods=["GET", "POST"])
def login():
    if request.method == "GET":
        return render_template("login.html")
    try:
        data = request.get_json()
        response = requests.post(
            f"{BACKEND_URL}/api/auth/login",
            json=data,
            headers={"Content-Type": "application/json"}
        )
        print(f"Backend response: {response.status_code} - {response.text}")
        return jsonify(response.json()), response.status_code
    except Exception as e:
        print(f"Login error: {e}")
        return jsonify({"message": "Backend unavailable"}), 500

@app.route("/signup", methods=["GET", "POST"])
def signup():
    if request.method == "GET":
        return render_template("signup.html")
    try:
        data = request.get_json()
        response = requests.post(
            f"{BACKEND_URL}/api/auth/signup",
            json=data,
            headers={"Content-Type": "application/json"}
        )
        print(f"Backend response: {response.status_code} - {response.text}")
        return jsonify(response.json()), response.status_code
    except Exception as e:
        print(f"Signup error: {e}")
        return jsonify({"message": "Backend unavailable"}), 500

@app.route("/forgot-password", methods=["GET"])
def forgot_password_page():
    return render_template("forgot_password.html")

@app.route("/api/forgot-password", methods=["GET"])
def forgot_password_api():
    email = request.args.get("email")
    try:
        res = requests.get(f"{BACKEND_URL}/api/auth/forgot-password?email={email}")
        return jsonify(res.json())
    except Exception as e:
        print(f"Forgot password error: {e}")
        return jsonify({"message": "Backend unavailable"}), 500

@app.route("/dashboard")
def dashboard():
    return render_template("dashboard.html")

@app.route("/api/patients", methods=["GET", "POST"])
def patients():
    token = request.headers.get("Authorization")
    try:
        headers = {"Authorization": f"Bearer {token}"}
        if request.method == "GET":
            res = requests.get(f"{BACKEND_URL}/api/patients", headers=headers)
        else:
            res = requests.post(f"{BACKEND_URL}/api/patients", headers=headers, json=request.get_json())

        print("Patient backend response:", res.status_code, res.text)
        return jsonify(res.json()), res.status_code
    except Exception as e:
        print(f"Patient error: {e}")
        return jsonify({"message": "Backend unavailable"}), 500


@app.route("/api/lung-scans", methods=["POST"])
def upload_scan():
    token = request.headers.get("Authorization")
    try:
        file = request.files["image"]
        patient_id = request.form.get("patient_id")
        files = {'image': (file.filename, file.stream, file.mimetype)}
        data = {'patient_id': patient_id}
        headers = {"Authorization": f"Bearer {token}"}
        res = requests.post(f"{BACKEND_URL}/api/lung-scans", headers=headers, files=files, data=data)

        try:
            return jsonify(res.json()), res.status_code
        except ValueError:
            print("❌ Invalid JSON returned by backend:", res.text)
            return jsonify({"message": "Backend error, invalid JSON"}), 500

    except Exception as e:
        print(f"Scan upload error: {e}")
        return jsonify({"message": "Scan upload failed"}), 500


@app.route("/api/predict", methods=["POST"])
def predict():
    token = request.headers.get("Authorization")
    try:
        body = request.get_json()
        print("🧪 Flask received scan_id:", body)
        scan_id = body.get("scan_id")
        if not scan_id:
            return jsonify({"message": "Missing scan_id"}), 400

        headers = {
            "Authorization": f"Bearer {token}",
            "Content-Type": "application/json"
        }

        res = requests.post(f"{BACKEND_URL}/api/predict/predict", headers=headers, json={"scan_id": scan_id})

        try:
            result = res.json()
            print("🧪 Prediction response:", result)
            return jsonify(result), res.status_code
        except ValueError:
            print("❌ Invalid JSON from backend:", res.text)
            return jsonify({"message": "Invalid backend response"}), 500
    except Exception as e:
        print(f"Prediction error: {e}")
        return jsonify({"message": "Prediction failed"}), 500




@app.route("/api/predictions/<scan_id>", methods=["GET"])
def get_prediction(scan_id):
    token = request.headers.get("Authorization")
    try:
        res = requests.get(f"{BACKEND_URL}/api/predictions/{scan_id}", headers={"Authorization": token})
        return jsonify(res.json()), res.status_code
    except Exception as e:
        print(f"Prediction fetch error: {e}")
        return jsonify({"message": "Prediction fetch failed"}), 500

@app.route("/test")
def test():
    try:
        res = requests.get(f"{BACKEND_URL}/ping")
        return jsonify(res.json())
    except Exception as e:
        print(f"Test error: {e}")
        return "FAILED", 500

if __name__ == "__main__":
    app.run(debug=True)
