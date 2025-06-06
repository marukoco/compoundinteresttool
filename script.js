document.getElementById("interest-form").addEventListener("submit", function (e) {
    e.preventDefault();

    const principal = parseFloat(document.getElementById("principal").value);
    const rate = parseFloat(document.getElementById("rate").value) / 100;
    const years = parseFloat(document.getElementById("years").value);
    const frequency = parseInt(document.getElementById("frequency").value);
    const pmt = parseFloat(document.getElementById("recurringAmount").value);
    const freq = parseFloat(document.getElementById("contributionFrequency").value);

    //基础复利计算
    const totalPrincipal = principal * Math.pow(1 + rate / frequency, frequency * years);

    // PMT 复利累计值
    let totalRecurring = 0;
    if (!isNaN(pmt) && !isNaN(freq) && freq > 0 && rate > 0) {
        totalRecurring = pmt * ((Math.pow(1 + rate / freq, freq * years) - 1) / (rate / freq));
    }

    // 总额 = 初始 + 定投
    const total = totalPrincipal + totalRecurring;

    document.getElementById("result").innerText = `Total Amount: $${total.toFixed(2)}`;

    if (isNaN(principal) || isNaN(rate) || isNaN(years) || isNaN(frequency)) {
        alert("Please fill in all fields correctly.");
        return;
    }

    document.getElementById("clearBtn").addEventListener("click", function () {
        document.getElementById("interest-form").reset();
        document.getElementById("result").innerText = "Please enter values and click Calculate.";
    });

});
