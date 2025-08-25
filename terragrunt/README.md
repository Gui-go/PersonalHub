# Terragrunt GCP Infrastructure

This repository manages Google Cloud Platform (GCP) infrastructure using Terragrunt and Terraform. It provides a structured approach to define, deploy, and manage cloud resources across different environments (e.g., `dev`, `prod`).

## Table of Contents

- [Project Purpose](#project-purpose)
- [Features](#features)
- [Prerequisites](#prerequisites)
- [Project Structure](#project-structure)
- [Authentication](#authentication)
- [Terraform State Backend](#terraform-state-backend)
- [Getting Started](#getting-started)
  - [Initialization](#initialization)
  - [Planning Changes](#planning-changes)
  - [Applying Changes](#applying-changes)
  - [Destroying Infrastructure](#destroying-infrastructure)
- [Modules](#modules)
- [Environments](#environments)
- [Contributing](#contributing)
- [License](#license)

## Project Purpose

The primary goal of this project is to define and deploy repeatable, version-controlled GCP infrastructure. By leveraging Terragrunt, it promotes the DRY (Don't Repeat Yourself) principle, allowing for reusable Terraform modules and consistent environment configurations.

## Features

*   **Modular Infrastructure:** Reusable Terraform modules for common GCP resources (e.g., service accounts, storage buckets).
*   **Environment-Specific Deployments:** Easily deploy the same infrastructure patterns to different environments (e.g., `dev`, `prod`) with environment-specific configurations.
*   **Remote State Management:** Securely stores Terraform state in a Google Cloud Storage (GCS) bucket, enabling team collaboration and preventing state loss.
*   **Dependency Management:** Terragrunt manages dependencies between different Terraform configurations, ensuring resources are deployed in the correct order.

## Prerequisites

Before you begin, ensure you have the following installed:

*   **Terraform:** [Install Terraform](https://developer.hashicorp.com/terraform/downloads) (version 1.0.0 or higher recommended).
*   **Terragrunt:** [Install Terragrunt](https://terragrunt.gruntwork.io/docs/getting-started/install/) (version 0.50.0 or higher recommended).
*   **Google Cloud SDK (gcloud CLI):** [Install gcloud CLI](https://cloud.google.com/sdk/docs/install) for authentication and interacting with GCP.
*   **jq (optional but recommended):** A lightweight and flexible command-line JSON processor, useful for parsing service account keys.

## Project Structure

The repository is organized as follows:

```
.
├── provider.tf                  # Global GCP provider configuration
├── terraform.tfvars             # Global Terraform variables (less common with Terragrunt)
├── terragrunt-sa.json           # Service Account key for authentication (sensitive, handle with care)
├── terragrunt.hcl               # Root Terragrunt configuration, defines remote state and common settings
├── environments/                # Contains environment-specific configurations
│   └── dev/                     # Development environment
│       ├── common.tfvars        # Common variables for the 'dev' environment
│       ├── env.tfvars           # Environment-specific variables for 'dev'
│       ├── terraform.tfvars     # Terraform variables for 'dev' (less common with Terragrunt)
│       └── terragrunt.hcl       # Terragrunt configuration for the 'dev' environment, includes modules
│       └── service_account/     # Example of a specific module deployment within 'dev'
│           ├── env.tfvars
│           └── terragrunt.hcl
└── modules/                     # Reusable Terraform modules
    ├── service_account/         # Module for creating GCP Service Accounts
    │   ├── main.tf
    │   ├── outputs.tf
    │   └── variables.tf
    └── storage/                 # Module for creating GCP Storage Buckets
        ├── main.tf
        ├── outputs.tf
        └── variables.tf
```

*   **`terragrunt.hcl` (root):** This file defines global settings, most importantly the remote state configuration for Terraform. It also includes `generate` blocks to create common provider and backend configurations for child modules.
*   **`environments/`:** Each subdirectory here represents a distinct deployment environment (e.g., `dev`, `staging`, `prod`). These directories contain `terragrunt.hcl` files that reference the reusable modules and provide environment-specific variable values.
*   **`modules/`:** This directory contains the actual reusable Terraform modules. Each module is a self-contained set of `.tf` files that define a specific piece of infrastructure.

## Authentication

This project is configured to authenticate with Google Cloud using a Service Account key file (`terragrunt-sa.json`).

**Steps to set up authentication:**

1.  **Create a Service Account:** In your GCP project, create a Service Account with the necessary permissions to manage the resources defined in your Terraform configurations.
2.  **Generate a JSON Key:** Create a new JSON key for this Service Account and download it.
3.  **Place the Key File:** Rename the downloaded JSON key file to `terragrunt-sa.json` and place it in the root of this repository.
4.  **Set Environment Variable:** Ensure the `GOOGLE_APPLICATION_CREDENTIALS` environment variable points to this file before running Terragrunt commands:
    ```bash
    export GOOGLE_APPLICATION_CREDENTIALS="$(pwd)/terragrunt-sa.json"
    ```
    *Alternatively, you can configure the `gcloud` CLI to use this service account.*

## Terraform State Backend

Terraform state is stored remotely in a Google Cloud Storage (GCS) bucket. This ensures state is shared among team members, provides versioning, and protects against accidental deletion.

The backend is configured in the root `terragrunt.hcl` file.

**Backend Configuration Details:**

*   **Bucket Name:** `your-gcp-project-id-tfstate` (replace `your-gcp-project-id` with your actual GCP project ID).
    *   **Important:** This bucket must exist *before* you run `terragrunt init` for the first time. You can create it manually via the GCP Console or `gcloud` CLI:
        ```bash
        gcloud storage buckets create gs://your-gcp-project-id-tfstate --project=your-gcp-project-id --location=YOUR_BUCKET_LOCATION
        ```
        (Replace `YOUR_BUCKET_LOCATION` with a suitable GCP region, e.g., `us-central1`).
*   **Prefix:** Each Terragrunt configuration will store its state file under a unique path within this bucket, typically `terragrunt/<environment>/<module>/terraform.tfstate`. This ensures isolation between different environments and modules.

## Getting Started

Follow these steps to deploy infrastructure using this project.

### Initialization

Navigate into an environment directory (e.g., `environments/dev`) and run `terragrunt init`. This command will download necessary provider plugins and initialize the Terraform working directory, configuring the remote backend.

```bash
cd environments/dev
terragrunt init
```

### Planning Changes

To see what changes Terragrunt and Terraform will make without actually applying them, run `terragrunt plan` from within an environment directory:

```bash
cd environments/dev
terragrunt plan
```
This will show a detailed execution plan. Review it carefully before applying.

### Applying Changes

To deploy the infrastructure defined in your configuration, run `terragrunt apply` from within an environment directory:

```bash
cd environments/dev
terragrunt apply
```
You will be prompted to confirm the changes before they are applied.

### Destroying Infrastructure

**Use with extreme caution!** This command will destroy all resources managed by the current Terragrunt configuration.

```bash
cd environments/dev
terragrunt destroy
```
You will be prompted to confirm the destruction.

## Modules

This section details the reusable Terraform modules available in the `modules/` directory.

### `modules/service_account`

*   **Purpose:** Creates a Google Cloud Service Account and optionally assigns IAM roles to it.
*   **Inputs:** Refer to `modules/service_account/variables.tf` for available input variables.
*   **Outputs:** Refer to `modules/service_account/outputs.tf` for available outputs (e.g., service account email).

### `modules/storage`

*   **Purpose:** Creates a Google Cloud Storage bucket.
*   **Inputs:** Refer to `modules/storage/variables.tf` for available input variables (e.g., bucket name, location, storage class).
*   **Outputs:** Refer to `modules/storage/outputs.tf` for available outputs (e.g., bucket self link).

## Environments

This section describes the different deployment environments configured in the `environments/` directory.

### `environments/dev`

*   **Purpose:** Development environment for testing new features and configurations.
*   **Configuration:** Uses `common.tfvars` and `env.tfvars` to define variables specific to the development environment.
*   **Deployment:** Deploys instances of the `service_account` and `storage` modules with `dev`-specific settings.

## Contributing

Contributions are welcome! Please follow these guidelines:

1.  Fork the repository.
2.  Create a new branch for your feature or bug fix.
3.  Make your changes and ensure they adhere to the project's coding standards.
4.  Write clear and concise commit messages.
5.  Submit a pull request.

## License

This project is licensed under the MIT License - see the `LICENSE` file for details (if applicable, otherwise remove this section).