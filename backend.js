import express from "express";
import { readFile, writeFile } from "node:fs/promises";

const app = express();
const port = 3000;

app.use(express.json()); //all data from and to the API is unique

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
			message: "Could not read carnaval groups",
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
				message: "Group not found",
			});
		}

		res.json(data[id]);
	} catch (error) {
		res.status(500).json({
			success: false,
			message: "Error fetching group",
		});
	}
});

// Post new carnaval group
app.post("/api/carnaval-groups", async (req, res) => {
	try {
		const newGroup = req.body;

		if (!newGroup.name || !newGroup.founded) {
			return res.status(400).json({ message: "Missing required fields" });
		}

		const contents = await readFile("carnaval-groups.json", "utf8");
		const data = JSON.parse(contents);

		data.push(newGroup);

		await writeFile("carnaval-groups.json", JSON.stringify(data, null, 2));

		res.status(201).json({ message: "Group added", data: newGroup });
	} catch (error) {
		res.status(500).json({ message: "Error adding group" });
	}
});

// Put updates an existing carnaval group
app.put("/api/carnaval-groups/:id", async (req, res) => {
	try {
		const id = Number(req.params.id);
		const updatedGroup = req.body;

		const contents = await readFile("carnaval-groups.json", "utf8");
		const data = JSON.parse(contents);

		if (!data[id]) {
			return res.status(404).json({ message: "Group not found" });
		}

		data[id] = updatedGroup;

		await writeFile("carnaval-groups.json", JSON.stringify(data, null, 2));
		res.json({ message: "Group updated", data: updatedGroup });
	} catch (error) {
		res.status(500).json({ message: "Error updating group" });
	}
});

// Delete a carnaval group
app.delete("/api/carnaval-groups/:id", async (req, res) => {
	try {
		const id = Number(req.params.id);

		const contents = await readFile("carnaval-groups.json", "utf8");
		const data = JSON.parse(contents);

		if (!data[id]) {
			return res.status(404).json({ message: "Group not found" });
		}

		const deletedGroup = data.splice(id, 1);

		await writeFile("carnaval-groups.json", JSON.stringify(data, null, 2));

		res.json({ message: "Group deleted", data: deletedGroup });
	} catch (error) {
		res.status(500).json({ message: "Error deleting group" });
	}
});

app.listen(port, () => {
	console.log(`Server running on http://localhost:${port}`);
});
