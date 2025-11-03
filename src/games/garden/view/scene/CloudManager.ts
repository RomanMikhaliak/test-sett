import {
  Scene,
  Group,
  Mesh,
  SphereGeometry,
  MeshStandardMaterial,
  Vector3,
} from "three";

export class CloudManager {
  private scene: Scene;
  private clouds: Group[] = [];
  private cloudSpeed: number = 0.08;
  private sharedMaterial: MeshStandardMaterial;
  private centerPoint: Vector3 = new Vector3(0, 0, 0);

  constructor(scene: Scene) {
    this.scene = scene;
    this.sharedMaterial = new MeshStandardMaterial({
      color: 0xffffff,
      roughness: 0.8,
      metalness: 0.1,
      transparent: true,
      opacity: 0.9,
    });
  }

  private createCloud(): Group {
    const cloudGroup = new Group();
    const sphereCount = Math.floor(Math.random() * 3) + 5;

    for (let i = 0; i < sphereCount; i++) {
      const radius = Math.random() * 1.5 + 1;
      const geometry = new SphereGeometry(radius, 16, 16);

      const sphere = new Mesh(geometry, this.sharedMaterial);

      sphere.position.x = (Math.random() - 0.5) * 3;
      sphere.position.y = -4 + (Math.random() - 0.5) * 1.5;
      sphere.position.z = -20 + (Math.random() - 0.5) * 2;

      sphere.castShadow = true;
      sphere.receiveShadow = false;

      cloudGroup.add(sphere);
    }

    return cloudGroup;
  }

  init(count: number = 5): void {
    for (let i = 0; i < count; i++) {
      const cloud = this.createCloud();

      const radius = 40 + Math.random() * 40;
      const angle = (Math.PI * 2 * i) / count + Math.random() * 0.5;

      cloud.position.x = this.centerPoint.x + Math.cos(angle) * radius;
      cloud.position.y = Math.random() * 10 + 15;
      cloud.position.z = this.centerPoint.z + Math.sin(angle) * radius;

      const scale = Math.random() * 0.5 + 0.8;
      cloud.scale.set(scale, scale, scale);
      cloud.userData.angle = angle;
      cloud.userData.radius = radius;
      cloud.userData.orbitSpeed = 0.8 + Math.random() * 0.4;

      this.scene.add(cloud);
      this.clouds.push(cloud);
    }
  }

  update(deltaTime: number): void {
    this.clouds.forEach((cloud) => {
      cloud.userData.angle +=
        this.cloudSpeed * cloud.userData.orbitSpeed * deltaTime * 0.1;
      const radius = cloud.userData.radius;
      cloud.position.x =
        this.centerPoint.x + Math.cos(cloud.userData.angle) * radius;
      cloud.position.z =
        this.centerPoint.z + Math.sin(cloud.userData.angle) * radius;
    });
  }

  dispose(): void {
    this.clouds.forEach((cloud) => {
      cloud.traverse((child) => {
        if (child instanceof Mesh) {
          child.geometry.dispose();
        }
      });
      this.scene.remove(cloud);
    });
    this.clouds = [];

    this.sharedMaterial.dispose();
  }
}
