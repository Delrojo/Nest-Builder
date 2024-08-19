import React, { useState } from "react";
import {
  Box,
  Checkbox,
  Input,
  Textarea,
  Button,
  Select,
  Stack,
  Heading,
} from "@chakra-ui/react";
import { TodoItem, TodoList, todoList } from "./todoData";

const TodoApp: React.FC = () => {
  const [todoData, setTodoData] = useState<TodoList>(todoList);
  const [newTodo, setNewTodo] = useState<TodoItem>({
    title: "",
    description: "",
    status: "To Do",
    priority: "Low",
    pagePath: "",
  });
  const [showForm, setShowForm] = useState(false);

  const handleInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;
    setNewTodo((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const addTodo = () => {
    if (newTodo.title) {
      setTodoData([...todoData, newTodo]);
      setNewTodo({
        title: "",
        description: "",
        status: "To Do",
        priority: "Low",
        pagePath: "",
      });
      setShowForm(false); // Hide form after adding todo
    }
  };

  const toggleTodoStatus = (index: number) => {
    const updatedTodos = todoData.map((todo, i) =>
      i === index
        ? {
            ...todo,
            status:
              todo.status === "To Do"
                ? "In Progress"
                : todo.status === "In Progress"
                ? "Completed"
                : "To Do",
          }
        : todo
    ) as TodoList;
    setTodoData(updatedTodos);
  };

  const printTodoData = () => {
    console.log("Todo Data:");
    console.log("==========");
    console.log(todoData);
    console.log(JSON.stringify(todoData, null, 2));
  };

  return (
    <Box p={5}>
      <Heading mb={5}>Todo List</Heading>
      <Button onClick={printTodoData} variant={"outline"} mb={4}>
        Print Todo Data
      </Button>
      <Box
        maxH="400px"
        overflowY="scroll"
        borderWidth={1}
        borderRadius={8}
        boxShadow="md"
        p={4}
      >
        <Stack spacing={4}>
          {todoData.map((todo, index) => (
            <Box
              key={index}
              p={4}
              borderWidth={1}
              borderRadius={8}
              boxShadow="md"
            >
              <Checkbox
                isChecked={todo.status === "Completed"}
                onChange={() => toggleTodoStatus(index)}
              >
                <strong>{todo.title}</strong> - {todo.priority} priority
              </Checkbox>
              <Box mt={2}>
                <em>{todo.description}</em>
              </Box>
              <Box mt={2} fontSize="sm" color="gray.500">
                {todo.pagePath}
              </Box>
              <Box mt={2} fontSize="sm" color="blue.500">
                Status: {todo.status}
              </Box>
            </Box>
          ))}
        </Stack>
      </Box>

      <Button mt={4} colorScheme="teal" onClick={() => setShowForm(!showForm)}>
        {showForm ? "Hide Form" : "Add New Task"}
      </Button>

      {showForm && (
        <Box mt={6}>
          <Input
            placeholder="Title"
            name="title"
            value={newTodo.title}
            onChange={handleInputChange}
            mb={2}
          />
          <Textarea
            placeholder="Description"
            name="description"
            value={newTodo.description}
            onChange={handleInputChange}
            mb={2}
          />
          <Select
            name="priority"
            value={newTodo.priority}
            onChange={handleInputChange}
            mb={2}
          >
            <option value="Low">Low</option>
            <option value="Medium">Medium</option>
            <option value="High">High</option>
          </Select>
          <Input
            placeholder="Page Path"
            name="pagePath"
            value={newTodo.pagePath}
            onChange={handleInputChange}
            mb={2}
          />
          <Button onClick={addTodo} colorScheme="blue" mb={2}>
            Add Todo
          </Button>
        </Box>
      )}
    </Box>
  );
};

export default TodoApp;
