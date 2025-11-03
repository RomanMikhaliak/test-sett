import { Pane, FolderApi, TabPageApi } from "tweakpane";

export interface PaneConfig {
  title?: string;
  expanded?: boolean;
  container?: HTMLElement;
}

export class PaneUtils {
  private static instance: Pane | null = null;
  private static folders: Map<string, FolderApi> = new Map();
  private static toggleHandler: ((e: KeyboardEvent) => void) | null = null;

  static createPane(config: PaneConfig = {}): Pane {
    if (PaneUtils.instance) {
      return PaneUtils.instance;
    }

    PaneUtils.instance = new Pane({
      title: config.title || "Debug Panel",
      expanded: config.expanded !== undefined ? config.expanded : true,
      container: config.container,
    });

    (PaneUtils.instance as any).hidden = true;

    return PaneUtils.instance;
  }

  static getPane(): Pane | null {
    return PaneUtils.instance;
  }

  static addFolder(
    name: string,
    options: { expanded?: boolean } = {}
  ): FolderApi {
    if (!PaneUtils.instance) {
      throw new Error("Pane not initialized. Call createPane() first.");
    }

    if (PaneUtils.folders.has(name)) {
      return PaneUtils.folders.get(name)!;
    }

    const folder = (PaneUtils.instance as any).addFolder({
      title: name,
      expanded: options.expanded !== undefined ? options.expanded : true,
    });

    PaneUtils.folders.set(name, folder);
    return folder;
  }

  static getFolder(name: string): FolderApi | undefined {
    return PaneUtils.folders.get(name);
  }

  static addBinding(
    object: any,
    property: string,
    options: any = {},
    folderName?: string
  ): void {
    const target = folderName
      ? PaneUtils.getFolder(folderName) || PaneUtils.instance
      : PaneUtils.instance;

    if (!target) {
      throw new Error("No target available for binding");
    }

    target.addBinding(object, property, options);
  }

  static addButton(
    title: string,
    onClick: () => void,
    folderName?: string
  ): void {
    const target = folderName
      ? PaneUtils.getFolder(folderName) || PaneUtils.instance
      : PaneUtils.instance;

    if (!target) {
      throw new Error("No target available for button");
    }

    target.addButton({ title }).on("click", onClick);
  }

  static addMonitor(
    object: any,
    property: string,
    options: any = {},
    folderName?: string
  ): void {
    const target = folderName
      ? PaneUtils.getFolder(folderName) || PaneUtils.instance
      : PaneUtils.instance;

    if (!target) {
      throw new Error("No target available for monitor");
    }

    target.addBinding(object, property, {
      readonly: true,
      interval: 100,
      ...options,
    });
  }

  static addSeparator(folderName?: string): void {
    const target = folderName
      ? PaneUtils.getFolder(folderName) || PaneUtils.instance
      : PaneUtils.instance;

    if (!target) {
      throw new Error("No target available for separator");
    }

    target.addBlade({ view: "separator" });
  }

  static addTab(pages: { title: string }[]): TabPageApi[] {
    if (!PaneUtils.instance) {
      throw new Error("Pane not initialized");
    }

    const tab = (PaneUtils.instance as any).addTab({ pages });
    return tab.pages;
  }

  static hide(): void {
    if (PaneUtils.instance) {
      (PaneUtils.instance as any).hidden = true;
    }
  }

  static show(): void {
    if (PaneUtils.instance) {
      (PaneUtils.instance as any).hidden = false;
    }
  }

  static toggle(): void {
    if (PaneUtils.instance) {
      (PaneUtils.instance as any).hidden = !(PaneUtils.instance as any).hidden;
    }
  }

  static setupKeyboardToggle(key: string = "p"): void {
    if (PaneUtils.toggleHandler) {
      return;
    }

    PaneUtils.toggleHandler = (e: KeyboardEvent) => {
      if (e.key === key || e.key === key.toUpperCase()) {
        PaneUtils.toggle();
      }
    };

    window.addEventListener("keydown", PaneUtils.toggleHandler);
  }

  static dispose(): void {
    if (PaneUtils.toggleHandler) {
      window.removeEventListener("keydown", PaneUtils.toggleHandler);
      PaneUtils.toggleHandler = null;
    }

    if (PaneUtils.instance) {
      PaneUtils.instance.dispose();
      PaneUtils.instance = null;
      PaneUtils.folders.clear();
    }
  }

  static refresh(): void {
    if (PaneUtils.instance) {
      (PaneUtils.instance as any).refresh();
    }
  }

  static export(): any {
    if (PaneUtils.instance) {
      return (PaneUtils.instance as any).exportState();
    }
    return null;
  }

  static import(state: any): void {
    if (PaneUtils.instance && state) {
      (PaneUtils.instance as any).importState(state);
    }
  }

  static setupCameraControls(camera: any, folderName: string = "Camera"): void {
    const cameraFolder = PaneUtils.addFolder(folderName, { expanded: false });

    cameraFolder
      .addBinding(camera, "fov", { min: 30, max: 120, step: 1 })
      .on("change", () => {
        camera.updateProjectionMatrix();
      });

    cameraFolder.addBinding(camera.position, "x", {
      min: -50,
      max: 50,
      step: 1,
    });

    cameraFolder.addBinding(camera.position, "y", {
      min: 0,
      max: 50,
      step: 1,
    });

    cameraFolder.addBinding(camera.position, "z", {
      min: -50,
      max: 50,
      step: 1,
    });
  }
}
