
  
// Save a new user account in localStorage
export const registerUser = (formData) => {
    const { studentNumber, password, confirmPassword } = formData;
  
    if (!studentNumber || !password || !confirmPassword) {
      return "All fields are required";
    }
  
    if (password !== confirmPassword) {
      return "Passwords do not match";
    }
  
    // Retrieve existing users from localStorage
    const users = JSON.parse(localStorage.getItem("users")) || [];
  
    // Check if studentNumber is already registered
    if (users.some((user) => user.studentNumber === studentNumber)) {
      return "Student number already registered";
    }
  
    // Add new user to the list
    users.push({ studentNumber, password, role: "student" });
  
    // Save updated list to localStorage
    localStorage.setItem("users", JSON.stringify(users));
  
    return true; // Registration successful
  };

 // Static credentials for registrar and department
export const getStaticUsers = () => [
  { identifier: "Registrar", password: "AdminRegistrar", role: "registrar" },
  { identifier: "Department", password: "AdminDepartment", role: "department" },
];


// Validate credentials function
export const validateCredentials = (identifier, password, role) => {
  if (!identifier || !password) {
    console.error("Validation failed: Missing username or password.");
    return "Please enter both username and password.";
  }

  // Retrieve dynamic users from localStorage
  const users = JSON.parse(localStorage.getItem("users")) || [];

  // Map dynamic users to match static user structure
  const mappedUsers = users.map((user) => ({
    identifier: user.studentNumber, // Map studentNumber to identifier
    password: user.password,
    role: user.role,
  }));

  // Combine static and dynamic users
  const allUsers = [...getStaticUsers(), ...mappedUsers];

  // Check if the username exists
  const userExists = allUsers.some(
    (u) => u.identifier.toLowerCase() === identifier.toLowerCase()
  );

  if (!userExists) {
    console.error(`Validation failed: Username not found. Identifier: ${identifier}`);
    return "The username does not exist. Please check your input.";
  }

  // Find a user matching the credentials
  const user = allUsers.find(
    (u) =>
      u.identifier.toLowerCase() === identifier.toLowerCase() &&
      u.password === password &&
      u.role === role
  );

  if (!user) {
    console.error(
      `Validation failed: Incorrect password or role. Identifier: ${identifier}, Role: ${role}`
    );
    return "Invalid password. Please try again.";
  }

  console.log("Validation success:", user);
  return user; // Return user object if login is successful
};
