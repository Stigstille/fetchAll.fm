async function getData(currentPage) {
  const username = document.getElementById("username").value;
  const apikey = document.getElementById("apikey").value;
  const url = `http://ws.audioscrobbler.com/2.0/?method=user.getrecenttracks&user=${username}&api_key=${apikey}&limit=1000&format=json&page=${currentPage}`;
  try {
    const response = await fetch(url);

    if (!response.ok) {
      const errorData = await response.json();
      console.log(errorData.message);
      throw new Error(`An error occured: ${response.status}: ${errorData.message}`);
    }

    const json = await response.json();
    return (json);
  } catch (error) {
    console.error(error.message);
    document.getElementById("important").innerHTML = error.message;
  }
  return null;
}

async function fetchData() {
  document.getElementById("important").innerHTML = "Button Clicked!";
  var totalPages = 1;
  var currentPage = 1;
  var jsonOutput = [];
  data = await getData(currentPage);
  totalPages = data.recenttracks["@attr"].totalPages;
  console.log("Total pages: " + totalPages);
  document.getElementById("important").innerHTML = "Total pages: " + totalPages;
  let removedElement = data.recenttracks.track.shift();
  for (let i = 0; i < data.recenttracks.track.length; i++) {
    jsonOutput.push(data.recenttracks.track[i]);
  }
  currentPage++;
  while (currentPage <= totalPages) {
    document.getElementById("important").innerHTML = `Fetching page: ${currentPage}/${totalPages}`;
    data = await getData(currentPage);
    if (data !== null) {  
        let removedElement = data.recenttracks.track.shift();
        for (let i = 0; i < data.recenttracks.track.length; i++) {
        jsonOutput.push(data.recenttracks.track[i]);
        }
        currentPage++;
    }
  }
  if (data != null) {
    console.log("Data fetched!");
    document.getElementById("important").innerHTML = "Data fetched!";
    console.log(jsonOutput);
    const jsonString = JSON.stringify(jsonOutput, null, 2);
    const blob = new Blob([jsonString], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'allLast.json';
    document.body.appendChild(a);
    a.click();
    URL.revokeObjectURL(url);
    document.body.removeChild(a);
  } else {
    console.log("No data");
    document.getElementById("important").innerHTML = "An error occured! Please try again later!";
  }
}
