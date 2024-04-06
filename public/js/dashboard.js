const addBtn = document.getElementById("domain-btn")
const wrapper = document.getElementById("wrapper")
const div3 = document.getElementById("div3")

addBtn.addEventListener('click', (e) => {
  wrapper.innerHTML = "";
  wrapper.innerHTML += `<div class="domain-name">
    <form action="/savedomain" method="post">
      <input type="text" name="domainname" autocomplete="off" id="text-box" placeholder="Add Domain Name"/>
      <button type="submit" id="save-btn">Save</button>
    </form>
  </div>`;
})


