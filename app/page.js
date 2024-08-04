"use client";
import Image from "next/image";
import { useState, useEffect } from "react";
import { firestore } from "@/firebase";

import {
  Box,
  Typography,
  Button,
  TextField,
  Modal,
  Stack,
} from "@mui/material";
import {
  collection,
  doc,
  getDocs,
  query,
  setDoc,
  deleteDoc,
  getDoc,
  updateDoc,
} from "firebase/firestore";

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 400,
  bgcolor: "white",
  border: "2px solid #000",
  boxShadow: 24,
  p: 4,
  display: "flex",
  flexDirection: "column",
  gap: 3,
  input:{
    color: "white"
  }
};

export default function Home(props) {
  const [inventory, setInventory] = useState([]);
  const [open, setOpen] = useState(false);
  const [openU, setOpenU] = useState(false);
  const [itemName, setItemName] = useState("");
  const [updatedName, setUpdatedName] = useState("");
  const [selectedItemId, setSelectedItemId] = useState(null); // Store the ID of the item to update
  const [searchTerm, setSearchTerm] = useState(""); // State for search input

  const updateInventory = async () => {
    const snapshot = query(collection(firestore, "inventory"));
    const docs = await getDocs(snapshot);
    const inventoryList = [];
    docs.forEach((doc) => {
      inventoryList.push({ name: doc.id, ...doc.data() });
    });
    setInventory(inventoryList);
  };

  useEffect(() => {
    updateInventory();
  }, []);

  const addItem = async (item) => {
    const docRef = doc(collection(firestore, "inventory"), item);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      const { quantity } = docSnap.data();
      await setDoc(docRef, { quantity: quantity + 1 });
    } else {
      await setDoc(docRef, { quantity: 1 });
    }
    await updateInventory();
  };

  const removeItem = async (item) => {
    const docRef = doc(collection(firestore, "inventory"), item);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      const { quantity } = docSnap.data();
      if (quantity === 1) {
        await deleteDoc(docRef);
      } else {
        await setDoc(docRef, { quantity: quantity - 1 });
      }
    }
    await updateInventory();
  };

  const plusOne = async (item) => {
    const docRef = doc(collection(firestore, "inventory"), item);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      const { quantity } = docSnap.data();
      await setDoc(docRef, { quantity: quantity + 1 });
    } else {
      await setDoc(docRef, { quantity: 1 });
    }
    await updateInventory();
  };

  const handleUpdate = async () => {
    try {
      // Get the current document reference
      const docRef = doc(collection(firestore, "inventory"), selectedItemId);

      // Get the current document data
      const docSnap = await getDoc(docRef);
      const currentData = docSnap.data();

      // Create a new document reference with the updated name
      const newDocRef = doc(collection(firestore, "inventory"), updatedName);

      // Update the document with the new name
      await setDoc(newDocRef, currentData);

      // Delete the old document with the original name
      await deleteDoc(docRef);

      setUpdatedName(""); // Clear the input field after updating
      console.log("Inventory item name updated successfully!");
      await updateInventory(); // Refresh the inventory list
      handleCloseU(); // Close the modal
    } catch (error) {
      console.error("Error updating inventory item name:", error);
    }
  };

  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
  };

  const filteredInventory = inventory.filter((item) => {
    // Case-insensitive search
    return item.name.toLowerCase().includes(searchTerm.toLowerCase());
  });

  const handleOpenU = async (item) => {
    setSelectedItemId(item); // Set the selected item ID
    setUpdatedName(item); // Set the initial value of the input field
    setOpenU(true);
  };

  const handleCloseU = () => setOpenU(false);

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  return (
    <Box
      width="100vw"
      height="100vh"
      display={"flex"}
      justifyContent={"center"}
      flexDirection={"column"}
      alignItems={"center"}
      gap={2}
    >
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          <Typography id="modal-modal-title" variant="h6" component="h2">
            Add Item
          </Typography>
          <Stack width="100%" direction={"row"} spacing={2}>
            <TextField
              id="outlined-basic"
              label="Item"
              variant="outlined"
              fullWidth
              value={itemName}
              onChange={(e) => setItemName(e.target.value)}
               sx={{
                input:{
                  color:'black'
                }
              }}
            />
            <Button
              variant="outlined"
              onClick={() => {
                addItem(itemName);
                setItemName("");
                handleClose();
              }}
            >
              Add
            </Button>
          </Stack>
        </Box>
      </Modal>

      <Modal
        open={openU}
        onClose={handleCloseU}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          <Typography id="modal-modal-title" variant="h6" component="h2">
            Update Item Name
          </Typography>
          <Stack width="100%" direction={"row"} spacing={2}>
            <TextField
              id="outlined-basic"
              label="New Name"
              variant="outlined"
              fullWidth
              value={updatedName}
              onChange={(e) => setUpdatedName(e.target.value)}
            />
            <Button variant="outlined" onClick={handleUpdate}>
              Change
            </Button>
          </Stack>
        </Box>
      </Modal>



      <Box border={"1px solid #333"} width={"80%"}>
        <Box
          width="100%"
          height="100px"
          bgcolor={"#1E90FF"}
          display={"flex"}
          justifyContent={"space-evenly"}
          alignItems={"center"}
        >
          <Typography variant={"h2"} color={"#333"} textAlign={"center"}>
            Inventory Items
          </Typography>

          <TextField
        type="text"
        label="Search items..."
        value={searchTerm}
        onChange={handleSearchChange}
        size="large"
        placeholder="Search...."
        variant="outlined"
        sx={{
          input: {
            color: 'black',
            border: '3px solid lightblue',
            bgcolor: 'white'
      
          }
        }}
      />
        </Box>
        <Stack
          width="100%"
          height="50vh"
          bgcolor={"white"}
          spacing={2}
          overflow={"auto"}
        >
          {filteredInventory.map(({ name, quantity }) => (
            <Box
              key={name}
              width="100%"
              minHeight="150px"
              display={"flex"}
              justifyContent={"space-between"}
              alignItems={"center"}
              bgcolor={"#f0f0f0"}
              paddingX={5}
            >
              <Typography variant={"h3"} color={"#333"} textAlign={"center"}>
                {name.charAt(0).toUpperCase() + name.slice(1)}
              </Typography>
              <Typography variant={"h3"} color={"#333"} textAlign={"center"}>
                Quantity: {quantity}
              </Typography>
              <Button
                variant="contained"
                color="error"
                onClick={() => removeItem(name)}
              >
                Remove
              </Button>
              <Button
                variant="contained"
                color="success"
                onClick={() => plusOne(name)}
              >
                Add
              </Button>
              <Button variant="contained" onClick={() => handleOpenU(name)}>
                Update
              </Button>
            </Box>
          ))}
        </Stack>
      </Box>

      <Button variant="contained" onClick={handleOpen} size="large">
        Add New Item
      </Button>
    </Box>
  );
}



