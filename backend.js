import express from "express";
//import { readFile, writeFile } from "node:fs/promises";
import dotenv from "dotenv";
import { MongoClient, ServerApiVersion, ObjectId } from "mongodb";
import cors from "cors";

dotenv.config();

const app = express();
const port = 3000;
const uri = process.env.MONGO_URI;

// Used Connect to cluster0 - example code for
// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
	serverApi: {
		version: ServerApiVersion.v1,
		strict: true,
		deprecationErrors: true,
	},
});

let db;

async function startServer() {
	try {
		await client.connect();

		db = client.db("courseproject");
		console.log("Connected to MongoDB Atlas");

		app.listen(port, () => {
			console.log(`Server running on http://localhost:${port}`);
		});
	} catch (error) {
		console.error("MongoDB connection failed:", error);
	}
}

startServer();

app.use(cors());
app.use(express.json()); //all data from and to the API is unique
app.use(express.static("public"));

// Test - confirming the API is operational
app.get("/", (req, res) => {
	res.send("Carnaval Halle API is running");
});

// Get all carnaval groups
app.get("/api/carnaval-groups", async (req, res) => {
	try {
		//CRUD using JSON
		//const contents = await readFile("carnaval-groups.json", "utf8");
		//const data = JSON.parse(contents);

		const collection = db.collection("halle_carnaval_db");
		// find({}) means "find all documents with no filter"
		// toArray() converts the result to a JavaScript array
		const groups = await collection.find({}).toArray();

		res.json(groups);
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
		//CRUD using JSON
		//const contents = await readFile("carnaval-groups.json", "utf8");
		//const data = JSON.parse(contents);

		const { id } = req.params;

		// Validate MongoDB ObjectId
		// Extracts the id from /api/carnaval-groups/:id
		if (!ObjectId.isValid(id)) {
			return res.status(400).json({
				message: "Invalid group ID",
			});
		}

		const collection = db.collection("halle_carnaval_db");

		//findOne() gets the first matching document
		//searching by custom "id" field
		const group = await collection.findOne({
			_id: new ObjectId(id),
		});

		//Checks if a group exists
		if (!group) {
			// 404 (Not Found)
			return res.status(404).json({
				success: false,
				message: "Group not found",
			});
		}

		res.json(group);
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
		//CRUD using JSON
		//const contents = await readFile("carnaval-groups.json", "utf8");
		//const data = JSON.parse(contents);
		//data.push(newGroup);
		//await writeFile("carnaval-groups.json", JSON.stringify(data, null, 2));

		const { name, founded, image, description } = req.body;

		// Basic validation
		// Reads JSON data sent from frontend form
		if (!name || !founded) {
			return res.status(400).json({ message: "Missing required fields" });
		}

		// Prevents empty or broken documents
		const newGroup = {
			name,
			founded,
			image: image || "",
			description: description || "",
			createdAt: new Date(),
		};

		const collection = db.collection("halle_carnaval_db");

		// Insert directly – MongoDB creates _id automatically
		const result = await collection.insertOne(newGroup);

		res.status(201).json({
			message: "Group added",
			data: {
				_id: result.insertedId,
				...newGroup,
			},
		});
	} catch (error) {
		res.status(500).json({ message: "Error adding group" });
	}
});

// Put updates an existing carnaval group
app.put("/api/carnaval-groups/:id", async (req, res) => {
	try {
		//CRUD using JSON
		//const contents = await readFile("carnaval-groups.json", "utf8");
		//const data = JSON.parse(contents);

		const { id } = req.params;
		const updatedGroup = req.body;

		// Validate MongoDB ObjectId
		if (!ObjectId.isValid(id)) {
			return res.status(400).json({
				message: "Invalid group ID",
			});
		}

		const collection = db.collection("halle_carnaval_db");

		// updateOne() takes two arguments:
		// 1. Filter: which document to update
		// 2. Update operation: what to change
		const result = await collection.updateOne(
			{ _id: new ObjectId(id) },
			{ $set: updatedGroup } // $set replaces the fields
		);

		// matchedCount tells us if we found the document
		if (result.matchedCount === 0) {
			return res.status(404).json({ message: "Group not found" });
		}

		//data[id] = updatedGroup;
		//await writeFile("carnaval-groups.json", JSON.stringify(data, null, 2));

		res.json({ message: "Group updated", data: updatedGroup });
	} catch (error) {
		res.status(500).json({ message: "Error updating group" });
	}
});

// Delete a carnaval group
app.delete("/api/carnaval-groups/:id", async (req, res) => {
	try {
		//CRUD using JSON
		//const contents = await readFile("carnaval-groups.json", "utf8");
		//const data = JSON.parse(contents);

		const { id } = req.params;

		// Validate MongoDB ObjectId
		if (!ObjectId.isValid(id)) {
			return res.status(400).json({ message: "Invalid group ID" });
		}

		const collection = db.collection("halle_carnaval_db");

		// First, get the group so we can return it
		const group = await collection.findOne({
			_id: new ObjectId(id),
		});

		if (!group) {
			return res.status(404).json({ message: "Group not found" });
		}

		// deleteOne() removes the document
		await collection.deleteOne({
			_id: new ObjectId(id),
		});

		//const deletedGroup = data.splice(id, 1);
		//await writeFile("carnaval-groups.json", JSON.stringify(data, null, 2));

		res.json({ message: "Group deleted", data: group });
	} catch (error) {
		res.status(500).json({ message: "Error deleting group" });
	}
});
