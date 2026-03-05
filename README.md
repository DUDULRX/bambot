# roarm_web_app

For the front-end code part, refer to the open source project: [bambot](https://github.com/timqian/bambot)

<img width="1130" alt="Screenshot of roarm_web_app" src="https://github.com/user-attachments/assets/ad73188b-c176-4210-900a-27f8aed5836a" />

## Supported Robots

Each robot has its own control mappings and coordinate controls.

- roarm_m2

- roarm_m3

---

## Deployment

### Deploy Locally

#### Prerequisites

- Node.js (>=20.x)
- npm (comes with Node.js)

#### Clone the repository:

```bash
git clone -b ugv_roarm https://github.com/waveshareteam/roarm_web_app.git
```

#### Environment preparation:

```bash
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo bash - && sudo apt-get install -y nodejs
```

#### Install dependencies:

```bash
cd roarm_web_app && npm install --legacy-peer-deps
```

#### Run the development server:

```bash
cd roarm_web_app &&  npm run build && npm run start
```

#### Open your browser and navigate to `http://localhost:3000` if running locally.

   If you're accessing the web app from another device in the same network, replace `localhost` with your computer's IP address, like:

   ```
   http://<your-ip-address>:3000
   ```

   Example: `http://192.168.9.185:3000`

---

## Acknowledgements

- Inspired by [bambot](https://github.com/timqian/bambot)

---

**Enjoy controlling your robot! 🤖🚀**