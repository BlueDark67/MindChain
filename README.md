# MindChain - Brainstorming

MindChain is a DBW-based brainstorming tool designed to simplify collaborative idea generation and organization. This README provides clear instructions for setting up, running, and continuing development on the project.

## Project Structure

- **BackEnd**: Contains server-side code.
- **FrontEnd**: Contains client-side code.

## Setup and Development

### Prerequisites

- Install Node.js and npm.
- Use Visual Studio Code or another code editor of your choice.
- Open a terminal to execute commands.

### Steps to Configure the Project

1. **Open a Terminal in Visual Studio Code**
    - Use the integrated terminal or an external one.

2. **Install Backend Dependencies**
    - Navigate to the BackEnd directory:
      ```
      cd BackEnd
      ```
    - Install all required dependencies:
      ```
      npm install
      ```

3. **Install Frontend Dependencies**
    - Navigate to the FrontEnd directory:
      ```
      cd ../FrontEnd
      ```
    - Install all required dependencies:
      ```
      npm install
      ```

4. **Return to the BackEnd Directory**
    - Change back to the BackEnd folder:
      ```
      cd ../BackEnd
      ```

5. **Launch the Server**
    - Start the development server:
      ```
      npm run dev
      ```

## Troubleshooting

If you encounter a security error (e.g., the following output):

```
+ CategoryInfo          : SecurityError: (:) [], PSSecurityException
+ FullyQualifiedErrorId : UnauthorizedAccess
```

Follow these steps to adjust the PowerShell execution policy:

1. Set the execution policy:
    ```
    set-ExecutionPolicy RemoteSigned -Scope CurrentUser
    ```
2. Verify the current execution policy:
    ```
    Get-ExecutionPolicy
    ```
3. List all execution policies:
    ```
    Get-ExecutionPolicy -list
    ```

Ensure you have the appropriate permissions to change the execution policy.

---

Happy brainstorming and coding!

