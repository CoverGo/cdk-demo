# CDK8S DEMO

## Introduction
- cdk8s is developed by AWS
- cdk8s are like library, which synthesizes k8s manifests
- cdk8s cli is workflow tool
- cdk8s supports typescript, python, golang

## Typescript
This demo will be using typescript.

- npm package: https://www.npmjs.com/package/cdk8s

- `cdk8s.yaml` is configuration for cdk8s cli
  
    ```yaml
    language: typescript
    app: node main.js
    imports:
      - k8s
    ```
    
    `language` can be Typescript/Python/GoLang
    
    `app` represents the command that `cdk8s synth` command will execute (in this case: `cdk8s synth` means execute `node main.js`)

- Frequently used  `class` is  `Chart`

  ```typescript
  // main.ts
  // for example like this
  // ...
  export class MyChart extends Chart {
    constructor(scope: Construct, id: string, props: ChartProps = { }) {
      super(scope, id, props);
      // define resources here
    }
  }
  // ...
  ```

- Easy to create deployment and expose as a service by simply compiling the ts file then run `cdk8s synth`

  ```typescript
  // main.ts
  // ...
  export class MyChart extends Chart {
    constructor(scope: Construct, id: string, props: ChartProps = { }) {
      super(scope, id, props);
      
      const deployment = new kplus.Deployment(this, "nginx", {
      	containers: [{imsage: "nginx"}],  
      }); // cdk8s will synthesize it into a 'Deployment' manifest
      
      deployment.expose(80); // cdk8s will synthesize it into 'Service' manifest
    }
  }
  // ...
  ```

- Use `Jest` to implement unit tests comparing synthesized result and Chart. This helps detect any expected and unexpected changes. (It is good to include this step in CI pipeline too)

