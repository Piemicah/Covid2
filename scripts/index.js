loadData("Total Cases");
document.querySelectorAll(".radio").forEach((radio) => {
  radio.addEventListener("change", () => {
    loadData(radio.value);
  });
});

let xScale;

let minValue;
let maxValue;

function loadData(option) {
  d3.csv("../data/covid_africa.csv", (d) => {
    return {
      country: d.Country,
      option: +d[`${option}`],
    };
  }).then((data) => {
    minValue = d3.min(data, (d) => d.option);
    maxValue = d3.max(data, (d) => d.option);
    xScale = d3.scaleLinear().domain([minValue, maxValue]).range([20, 1500]);
    data.sort((a, b) => b["option"] - a["option"]);

    createViz(data);
  });
}

const svg = d3
  .select(".responsive-svg-container")
  .append("svg")
  .attr("viewBox", "0 0 1700 2500")
  .style("border", "none");
const createViz = (data) => {
  d3.selectAll("g > *").remove();

  const yScale = d3
    .scaleBand()
    .domain(data.map((d) => d.country))
    .range([0, 2500])
    .paddingInner(0.35);

  const barAndLabel = svg
    .selectAll("g")
    .data(data)
    .join("g")
    .attr("transform", (d) => `translate(0, ${yScale(d.country)})`)
    .append("rect");

  barAndLabel
    .attr("height", yScale.bandwidth())
    .attr("width", (d) => xScale(d.option))
    .attr("x", "100")
    .attr("y", "0")
    .attr("fill", (d) => (d.country === "Nigeria" ? "green" : "blue"));

  svg
    .selectAll("g")
    .append("text")
    .text((d) => d.country)
    .attr("x", 96)
    .attr("y", 12)
    .attr("text-anchor", "end")
    .style("font-family", "sans-serif")
    .style("font-size", "14px");

  svg
    .selectAll("g")
    .append("text")
    .text((d) => d.option)
    .attr("x", (d) => 100 + xScale(d.option) + 4)
    .attr("y", 12);

  svg
    .append("line")
    .attr("x1", 100)
    .attr("y1", 0)
    .attr("x2", 100)
    .attr("y2", 2500)
    .attr("stroke", "black");
};
