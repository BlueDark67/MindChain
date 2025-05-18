//Função que trata os erros
const handleErros = (res) => {
  if (!res.ok) {
    throw Error(res.status + " - " + res.url);
  }
  return res;
};

//API que busca o historico de salas do usuario
export const fetchHistory = async (userId) => {
  try {
    const res = await fetch("http://localhost:3000/fetch-history", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify({ userId: userId }),
    });
    handleErros(res);
    const json = await res.json();
    return json;
  } catch (err) {
    console.error(err);
    return null;
  }
};

//Função que agrupa as salas por data
export function groupRoomsByDate(rooms) {
  const today = new Date();
  const startOfToday = new Date(
    today.getFullYear(),
    today.getMonth(),
    today.getDate()
  );

  // Início da semana atual (domingo)
  const startOfThisWeek = new Date(today);
  startOfThisWeek.setDate(today.getDate() - today.getDay()); // Domingo
  startOfThisWeek.setHours(0, 0, 0, 0);

  // Início da semana passada (domingo anterior)
  const startOfLastWeek = new Date(startOfThisWeek);
  startOfLastWeek.setDate(startOfThisWeek.getDate() - 7);

  // Fim da semana passada (sábado anterior)
  const endOfLastWeek = new Date(startOfThisWeek);
  endOfLastWeek.setDate(startOfThisWeek.getDate() - 1);

  // Início do mês atual
  const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);

  // Início do mês passado
  const startOfLastMonth = new Date(
    today.getFullYear(),
    today.getMonth() - 1,
    1
  );

  // Fim do mês passado (um dia antes do início do mês atual)
  const endOfLastMonth = new Date(startOfMonth);
  endOfLastMonth.setDate(startOfMonth.getDate() - 1);

  const startOfYear = new Date(today.getFullYear(), 0, 1);

  const groups = {
    today: [],
    thisWeek: [],
    lastWeek: [],
    lastMonth: [],
    months: {}, // { '2024-03': [rooms] }
    years: {}, // { '2023': [rooms] }
  };

  const monthNames = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  rooms.forEach((room) => {
    const created = new Date(room.createdAt);

    if (created >= startOfToday) {
      groups.today.push(room);
    } else if (created >= startOfThisWeek) {
      groups.thisWeek.push(room);
    } else if (created >= startOfLastWeek && created <= endOfLastWeek) {
      groups.lastWeek.push(room);
    } else if (created >= startOfLastMonth && created <= endOfLastMonth) {
      groups.lastMonth.push(room);
    } else if (created >= startOfYear) {
      // Agrupa por mês
      const monthKey = `${monthNames[created.getMonth()]}`;
      if (!groups.months[monthKey]) groups.months[monthKey] = [];
      groups.months[monthKey].push(room);
    } else {
      // Agrupa por ano
      const yearKey = `${created.getFullYear()}`;
      if (!groups.years[yearKey]) groups.years[yearKey] = [];
      groups.years[yearKey].push(room);
    }
  });

  return groups;
}
