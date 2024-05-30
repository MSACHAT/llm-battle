declare module "malarkey" {
  type MalarkeyCallback = (text: string | null) => void;

  interface MalarkeyOptions {
    typeSpeed?: number;
    deleteSpeed?: number;
    pauseDuration?: number;
    repeat?: boolean;
  }

  interface MalarkeyInstance {
    type: (text: string) => MalarkeyInstance;
    delete: (text: string) => MalarkeyInstance;
    pause: (duration: number) => MalarkeyInstance;
  }

  function malarkey(
    callback: MalarkeyCallback,
    options?: MalarkeyOptions,
  ): MalarkeyInstance;

  export = malarkey;
}
