import { Construct } from 'constructs';
import { App, Chart, ChartProps } from 'cdk8s';
import { KubeDeployment, KubeService, IntOrString } from './imports/k8s';

export class MyChart extends Chart {
  constructor(scope: Construct, id: string, props: ChartProps = { }) {
    super(scope, id, props);


    const label = { 'k8s-app': 'covergo-auth','team':'backend' };
    const namespace = "development";
    const env = [{"name": "datacenterId","value": "12factor"},{"name": "terminationTimeout",
    "value": "30"},{"name": "ASPNETCORE_ENVIRONMENT",
    "value": "Production"},{"name": "TRACING_ENABLED",
    "value": "true"},{"name": "TRACING_CONNECTION_STRING",
    "value": "http://opentelemetry-collector.open-telemetry:4317"},{"name": "TRACING_EXPORT_TIMEOUT",
    "value": "1000"}]
    const envFrom = [{"secretRef":
      {"name": "covergo-database"}},{"secretRef":
      {"name": "covergo-password"}}]

    // notice that there is no assigment necessary when creating resources.
    // simply instantiating the resource is enough because it adds it to the construct tree via
    // the first argument, which is always the parent construct.
    // its a little confusing at first glance, but this is an inherent aspect of the constructs
    // programming model, and you will encounter it many times.
    // you can still perform an assignment of course, if you need to access
    // atrtibutes of the resource in other parts of the code.

    new KubeService(this, 'service', {
      metadata: {
        namespace: namespace,
        annotations:{ "reloader.stakater.com/auto": "true"}
      },
      spec: {
        type: 'LoadBalancer',
        ports: [ { port: 80, targetPort: IntOrString.fromNumber(8080), protocol: 'TCP', name: 'tcp-8080-8080-kg68l' } ],
        selector: label,
      }
    });

    new KubeDeployment(this, 'deployment', {
      metadata: {
        namespace: namespace,
      },
      spec: {
        replicas: 2,
        selector: {
          matchLabels: label
        },
        template: {
          metadata: { labels: label , annotations: {
            "linkerd.io/inject":"enabled"}},
          spec: {
            terminationGracePeriodSeconds: 60,
            containers: [
              {
                name: 'covergo-auth',
                image: 'registry-intl.cn-hongkong.aliyuncs.com/covergo/auth:latest',
                ports: [ { containerPort: 8080 } ],
                env: env,
                envFrom: envFrom,
                imagePullPolicy: 'Always',

              }
            ],
            imagePullSecrets: [{"name":"registry-intl.cn-hongkong.aliyuncs.com"}],
            restartPolicy: 'Always'
          }
        }
      }
    });
  }
}

const app = new App();
new MyChart(app, 'cdk-demo');
app.synth();
