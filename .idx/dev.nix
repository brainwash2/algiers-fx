# .idx/dev.nix
{pkgs}: {
  # Which nixpkgs channel to use.
  channel = "stable-24.05"; 
  
  # Use https://search.nixos.org/packages to find packages
  packages = [
    pkgs.nodejs_20
    pkgs.yarn
    pkgs.nodePackages.pnpm
    pkgs.bun
    
    # --- ADDED FOR BACKEND ---
    pkgs.python3
    pkgs.python311Packages.pip
    pkgs.python311Packages.virtualenv
    # -------------------------
  ];
  
  # Sets environment variables in the workspace
  env = {};
  
  idx = {
    # Search for the extensions you want on https://open-vsx.org/ and use "publisher.id"
    extensions = [
      "google.gemini-cli-vscode-ide-companion"
      "ms-python.python" # <-- Essential for Python IntelliSense
    ];
    
    workspace = {
      # Runs when a workspace is first created with this `dev.nix` file
      onCreate = {
        npm-install = "npm ci --no-audit --prefer-offline --no-progress --timing";
        
        # Open editors for the following files by default, if they exist:
        default.openFiles = [
          "app/page.tsx" 
          "src/app/page.tsx"
        ];
      };
    };
    
    # Enable previews and customize configuration
    previews = {
      enable = true;
      previews = {
        web = {
          command = ["npm" "run" "dev" "--" "--port" "$PORT" "--hostname" "0.0.0.0"];
          manager = "web";
        };
      };
    };
  };
}