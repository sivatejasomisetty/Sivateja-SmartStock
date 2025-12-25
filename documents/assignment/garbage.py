import gc

class Demo:
    def __init__(self, name):
        self.name = name
        self.ref = None
        print(f"[INIT]   Created {self.name} (id={id(self)})")

    def __del__(self):
        print(f"[DEL]    Destroying {self.name} (id={id(self)})")

def create_reference_cycle():
    print("\n[STEP] Creating objects with a reference cycle...")
    a = Demo("A")
    b = Demo("B")
    
    a.ref = b
    b.ref = a
    print(f"[INFO]   {a.name} references {b.name}")
    print(f"[INFO]   {b.name} references {a.name}")
    
    return a, b

def main():
    print("[INFO] GC initially enabled?", gc.isenabled())


    # Disable automatic garbage collection (reference counting still works)
    print("\n[STEP] Disabling automatic GC...")
    gc.disable()
    print("[INFO] GC enabled?", gc.isenabled())

    a, b = create_reference_cycle()

    print("\n[STEP] Deleting external references (but cycle remains)...")
    del a
    del b

    print("\n[STEP] Forcing manual garbage collection...")
    collected = gc.collect()
    print(f"[RESULT] Collected unreachable objects: {collected}")

    print("\n[STEP] Re‑enabling automatic GC...")
    gc.enable()
    print("[INFO] GC enabled?", gc.isenabled())

    # Show current GC counts since last collection
    print("\n[INFO] GC counts (gen0, gen1, gen2):", gc.get_count())

if __name__ == "__main__":
    main()