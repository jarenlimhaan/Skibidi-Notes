# Skibidi Notes
---

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


## Running the Development server 
1. **Ensure Make is Installed**:
    - Follow the instructions in the "How to Download and Install Make on Windows and Mac" section above to install `make` on your system.

2. **Install Dependencies**:
    - Run the following command to install all required dependencies:
      ```bash
      make install-dep
      ```

3. **Run the Development Server**:
    - Start the server by running:
      ```bash
      make run
      ```

