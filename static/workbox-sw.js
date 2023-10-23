self.addEventListener('fetch', event => {
    event.respondWith(
      fetch(event.request, {cache: "no-store"})
        .catch(error => {
          console.error("Fetch failed:", error);
          throw error;
        })
    );
  });