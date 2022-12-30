const container = document.getElementById("container");

      const graph = new $mwt.GraphX(container)
        .addNode("John", {
          x: 0,
          y: 10,
          size: 15,
          label: "John",
          color: "blue",
        })
        .addNode("Mary", { x: 10, y: 0, size: 10, label: "Mary", color: "red" })
        .addEdgeWithKey("John->Mary", "John", "Mary");


      // Controls
      const camera = graph.getCamera();
      const btnZoomIn = document.getElementById("zoomIn");
      btnZoomIn.addEventListener("click", () => {
        camera.animatedZoom({ duration: 600 });
      });

      const btnZoomOut = document.getElementById("zoomOut");
      btnZoomOut.addEventListener("click", () => {
        camera.animatedUnzoom({ duration: 600 });
      });

      const btnZoomReset = document.getElementById("zoomReset");
      btnZoomReset.addEventListener("click", () => {
        camera.animatedReset({ duration: 600 });
      });

      const btnClear = document.getElementById("clear");
      btnClear.addEventListener("click", () => {
        graph.clear();
      });


      // counters
      const orderField = document.getElementById("order");
      orderField.innerHTML = graph.order();
      const nNodesField = document.getElementById("numNodes");
      nNodesField.innerHTML = graph.nodes().length;
      const nEdgesField = document.getElementById("numEdges");
      nEdgesField.innerHTML = graph.edges().length;

      // JSON Viewer
      const jsonViewer = document.getElementById("jsonViewer");
      jsonViewer.innerHTML = graph.toJSON();

      const refresh = () => {
        orderField.innerHTML = graph.order();
        nEdgesField.innerHTML = graph.edges().length;
        console.log(graph.edges())
        nNodesField.innerHTML = graph.nodes().length;
        jsonViewer.innerHTML = graph.toJSON();
      }

      graph.onNodeAdded(refresh);
      graph.onNodeDropped(refresh);
      graph.onCleared(refresh);

      

      // Animations
      graph.enableElasticAnimation();

      // add node example
      graph.on("clickStage", ({ event }) => {
        //  screen (viewport) coordinates are not the same.
        // So need to translate the screen x & y coordinates to the graph one by calling the helper `viewportToGraph`
        const coordForGraph = graph.renderer.viewportToGraph({ x: event.x, y: event.y });

        // create a new node
        const node = {
          ...coordForGraph,
          size: 15,
          color: $mwt.chroma.random().hex(),
        };

        // Searching the two closest nodes to auto-create an edge to it
        const closestNodes = graph
          .nodes()
          .map((nodeId) => {
            const attrs = graph.getNodeAttributes(nodeId);
            const distance = Math.pow(node.x - attrs.x, 2) + Math.pow(node.y - attrs.y, 2);
            return { nodeId, distance };
          })
          .sort((a, b) => a.distance - b.distance)
          .slice(0, 2);

        // register the new node into instance
        const id = prompt('Type here node name');
        if (id != null) {
          if(graph.hasNode(id)) { alert("esiste già") }
          else { 
            node.label = id;
            graph.addNode(id, node);
            //create the edges
            closestNodes.forEach((e) => {
              graph.addEdgeWithKey(id+"->"+e.nodeId, id, e.nodeId)});
          }
        }
      });


      

      
      
