export default function CurrentShow() {
  return (
    <div className="text-pretty" style={{ width: "min(650px, 100vw)" }}>
      <div className="px-[10px]">
        <div className="pb-2">
          <h1 className="text-lg">Current Show</h1>
          <p className="max-w-[calc(100vw - 40px)]">
            No current show. Please check back soon!
          </p>
        </div>
      </div>
    </div>
  );
}