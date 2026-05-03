export const buildGraph = (text) => {
  const lines = text.split("\n");

  const nodes = [];
  const edges = [];

  lines.forEach((line) => {
    line = line.trim();

    // Detect Interface
    if (line.includes("<<interface>>")) {
      const name = line.replace("<<interface>>", "").trim();
      nodes.push({ id: name, type: "interface" });
    }

    // Detect Class
    else if (line.startsWith("Class")) {
      const name = line.split(":")[1]?.trim();
      if (name) nodes.push({ id: name, type: "class" });
    }

    // Inheritance (A --|> B)
    else if (line.includes("--|>")) {
      const [from, to] = line.split("--|>").map((s) => s.trim());
      edges.push({ from, to, type: "inheritance" });
    }

    // Implementation (A ..|> B)
    else if (line.includes("..|>")) {
      const [from, to] = line.split("..|>").map((s) => s.trim());
      edges.push({ from, to, type: "implements" });
    }

    // Dependency (A ..> B)
    else if (line.includes("..>")) {
      const [from, to] = line.split("..>").map((s) => s.trim());
      edges.push({ from, to, type: "dependency" });
    }

    // Association (A --> B)
    else if (line.includes("-->")) {
      const [from, to] = line.split("-->").map((s) => s.trim());
      edges.push({ from, to, type: "association" });
    }

    // Creation (Factory creates Product)
    else if (line.toLowerCase().includes("creates")) {
      const [from, to] = line.split("creates").map((s) => s.trim());
      edges.push({ from, to, type: "creates" });
    }
  });

  return { nodes, edges };
};