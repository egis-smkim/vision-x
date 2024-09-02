var modal = document.getElementById("myModal");

function openDashboard() {
    var modal = document.getElementById("myModal");
    var element_dashboard_on = document.getElementById("dashboard-on");
    var element_dashboard_off = document.getElementById("dashboard-off");

    modal.style.display = "block";
    element_dashboard_on.style.display = "none";
    element_dashboard_off.style.display = "block";

    handleRenderMap();
    handleRenderChart();
}

function closeDashboard() {
    var modal = document.getElementById("myModal");
    var element_dashboard_on = document.getElementById("dashboard-on");
    var element_dashboard_off = document.getElementById("dashboard-off");

    modal.style.display = "none";
    element_dashboard_on.style.display = "block";
    element_dashboard_off.style.display = "none";

    $("#modal-world-map").html("");
    $("#modal-chart-server").html("");
}

// 모달 외부 클릭 시 모달 닫기
window.onclick = function(event) {
    if (event.target == modal) {
        modal.style.display = "none";
    }
}
