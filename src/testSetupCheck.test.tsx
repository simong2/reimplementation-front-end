import "@testing-library/jest-dom";

test("jest-dom is working", () => {
  const div = document.createElement("div");
  div.textContent = "Test Element";
  document.body.appendChild(div);

  expect(document.body).toHaveTextContent("Test Element");
});
