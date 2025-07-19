# Skibidi Notes
---

Please use python `3.10.18`

## Table of Contents

- [How to Download and Install Make on Windows and Mac](#how-to-download-and-install-make-on-windows-and-mac)
  - [Installing Make on Windows](#installing-make-on-windows)
  - [Installing Make on Mac](#installing-make-on-mac)
  - [Additional Notes](#additional-notes)
- [Project Dependencies requirement](#project-dependencies-requirement)
  - [Frontend Dependencies](#frontend-dependencies)
  - [Backend Dependencies](#backend-dependencies)
  - [Database](#database)
    - [Installing Docker on Windows](#installing-docker-on-windows)
    - [Installing Docker on Mac](#installing-docker-on-mac)
    - [Additional Notes](#additional-notes-1)
  - [Installing all dependencies in one go](#installing-all-dependencies-in-one-go)
- [Running the Development server](#running-the-development-server)

## Branches
For local development and testing, use the `dev` branch. All new features and changes should be committed here. The `prod` branch is reserved for deployment and production releases. Merge tested changes from `dev` into `prod` when ready to deploy.

## Deployment
You can view detailed deployment instructions by clicking [here](docs/deployment/info.md).

## How to Download and Install Make on Windows and Mac
We will be using make to run our development server as well as core custom commands within our makefile to ease development.

### Installing Make on Windows

1. **Using Chocolatey**:
    - Ensure you have [Chocolatey](https://chocolatey.org/install) installed on your system.
    - Open a Command Prompt or PowerShell with administrator privileges.
    - Run the following command:
      ```bash
      choco install make
      ```
    - Once the installation is complete, verify it by running:
      ```bash
      make --version
      ```

2. **Alternative Method**:
    - Download the Make binary from [GnuWin](http://gnuwin32.sourceforge.net/packages/make.htm).
    - Follow the installation instructions provided on the website.

### Installing Make on Mac

1. **Using Homebrew**:
    - Ensure you have [Homebrew](https://brew.sh/) installed on your system.
    - Open a Terminal and run the following command:
      ```bash
      brew install make
      ```

2. **Verify Installation**:
    - After installation, check the version of Make:
      ```bash
      make --version
      ```

### Additional Notes
- Ensure that `make` is added to your system's PATH if it is not automatically configured.


## Project Dependencies requiremnet 

For this section, you only need to install NodeJS + python, we will be installing everything in one go in the [section](#running-the-development-server) :
1. We will be using `npm` to manage our frontend dependencies 
2. We will be using `poetry` to manage our backend dependencies 

### Frontend Dependencies

For the frontend, we are using a Next.js application. To set up the environment, you need to install Node.js.

1. **Install Node.js**:
  - Download and install the latest LTS version of Node.js from [Node.js Official Website](https://nodejs.org/).
  - Verify the installation by running:
    ```bash
    node --version
    npm --version
    ```

### Backend Dependencies

For the backend, we are using Python with Poetry for dependency management.

1. **Install Python**:
  - Download and install Python from [Python Official Website](https://www.python.org/).
  - Ensure Python is added to your system's PATH.

### Redis Service

Docker is required to containerize and manage the redis service used for this project. Follow the steps below to install Docker on your system:

#### Installing Docker on Windows

1. **Download Docker Desktop**:
    - Visit the [Docker Desktop for Windows](https://www.docker.com/products/docker-desktop) page and download the installer.

2. **Install Docker Desktop**:
    - Run the installer and follow the on-screen instructions.
    - Ensure that the "Use WSL 2 instead of Hyper-V" option is selected during installation if you are using Windows Subsystem for Linux.

3. **Verify Installation**:
    - Open a Command Prompt or PowerShell and run:
      ```bash
      docker --version
      ```

#### Installing Docker on Mac

1. **Download Docker Desktop**:
    - Visit the [Docker Desktop for Mac](https://www.docker.com/products/docker-desktop) page and download the installer.

2. **Install Docker Desktop**:
    - Open the downloaded `.dmg` file and drag the Docker icon to your Applications folder.
    - Launch Docker Desktop and follow the setup instructions.

3. **Verify Installation**:
    - Open a Terminal and run:
      ```bash
      docker --version
      ```

#### Additional Notes
- Ensure Docker is running before using any Docker-related commands.
- You may need to log in to Docker Hub to pull images. Create an account at [Docker Hub](https://hub.docker.com/) if you don't already have one.


### Installing all dependencies in one go  
1. **Ensure Make is Installed**:
    - Follow the instructions in the ["How to Download and Install Make on Windows and Mac"](#how-to-download-and-install-make-on-windows-and-mac) section to install `make` on your system.

2. **Install Dependencies**:
    - Run the following command to install all required dependencies:
      ```bash
      make install
      ```

## Running the Development server 
1. **Set up Redis*:
    - Set up the redis service by running:
      ```bash
      docker compose up -d
      ``` 

2. **Run the Development Server**:
    - Start the server by running:
      ```bash
      make run
      ```
