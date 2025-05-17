const handleErros = (res) => {
  if (!res.ok) {
    throw Error(res.status + " - " + res.url);
  }
  return res;
};

export const fetchUserProgress = async (userId) => {
    try {
        const res = await fetch("http://localhost:3000/userMetrics", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ userId }),
        });

        if (!res.ok) {
            throw new Error("Failed to fetch user progress");
        }

        return await res.json();
    } catch (error) {
        console.error("Error fetching user progress:", error);
        return null;
    }
};
