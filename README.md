# MindChain - brainstorming

Projeto DBW - Ferramenta de trabalho de brainstorming

# What to do after opening in visual studio code
1º Open a terminal
2º In terminal use cd BackEnd - with this we are in BackEnd directory
3º Use npm install - This will install every dependicie of the directory
4º Use cd ../FrontEnd - with this we leave the BackEnd Directory and go to FontEnd directory
5º Use npm install - This will install every dependicie of the directory
6º Then go back to the BackEnd directory using cd ../BackEnd
7º Launch server

# Start server

    npm run dev

# if we get this erro

    + CategoryInfo          : SecurityError: (:) [], PSSecurityException
    + FullyQualifiedErrorId : UnauthorizedAccess

1º step: set-ExecutionPolicy RemoteSigned -Scope CurrentUser
2º step: Get-ExecutionPolicy
3º step: Get-ExecutionPolicy -list
