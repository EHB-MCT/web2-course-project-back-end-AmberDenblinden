import express from "express";
import { readFile } from "node:fs/promises";

const app = express();
const port = 3000;

app.use(express.json()); //alle data van en naar de api is uniek

app.listen(port, () => {
	console.log(`Example app listening on port ${port}`);
});

app.use(express.static("public"));

// Test - confirming the API is operational
app.get("/", (req, res) => {
	res.send("Carnaval Halle API is running");
});

// Get all carnaval groups
app.get("/api/carnaval-groups", async (req, res) => {
	try {
		const contents = await readFile("carnaval-groups.json", "utf8");
		const data = JSON.parse(contents);
		res.json(data);
	} catch (error) {
		//500 (Internal Server Error)
		res.status(500).json({ 
			success: false,
			message: "Could not read carnaval groups"
		});
	}
});

// Get one carnaval group
app.get("/api/carnaval-groups/:id", async (req, res) => {
	try {
		const id = Number(req.params.id);
		const contents = await readFile("carnaval-groups.json", "utf8");
		const data = JSON.parse(contents);

		//Checks if a group exists
		if (!data[id]) { 
			// 404 (Not Found)
			return res.status(404).json({ 
				success: false,
				message: "Group not found"
			});
		}

		res.json(data[id]);
	} catch (error) {
		res.status(500).json({
			success: false,
			message: "Error fetching group"
		});
	}
});

// Post new carnaval group 
app.post("/api/carnaval-groups", (req, res) => {
	const newGroup = req.body;
	console.log(newGroup);

	res.json({
		success: true,
		message: "Group received",
		data: newGroup
	});
});

app.listen(port, () => {
	console.log(`Server running on http://localhost:${port}`);
});