// ======================================================
// GLOBAL VARIABLE
// ======================================================

let semuaProduk = [];
let kategoriAktif = "Semua";

const API_URL =
"https://script.google.com/macros/s/AKfycbxkRGQ-MBt1hgHs1zppZEgGbeKBji4Snj0zTLr3JA7RxOi44M7t1OtYXgdY0wlqtvJW/exec";


// ======================================================
// LOADING
// ======================================================

function tampilkanLoading(){

    document.getElementById("loading").style.display = "block";

    document.getElementById("product-list").style.display = "none";

}

function sembunyikanLoading(){

    document.getElementById("loading").style.display = "none";

    document.getElementById("product-list").style.display = "flex";

}


// ======================================================
// LOAD DATA
// ======================================================

async function loadData(){

    tampilkanLoading();

    try{

        const response = await fetch(API_URL);

        const data = await response.json();

        semuaProduk = data.filter(item =>

            item.status &&
            item.status.trim().toLowerCase() === "aktif"

        );

        updateStatistik();

        tampilkanKategori();

        filterProduk();

        sembunyikanLoading();

    }

    catch(error){

        sembunyikanLoading();

        console.error("Gagal mengambil data :", error);

        document.getElementById("product-list").innerHTML = `

        <div class="col-12">

            <div class="alert alert-danger text-center">

                Gagal mengambil data dari server.

            </div>

        </div>

        `;

    }

}


// ======================================================
// STATISTIK
// ======================================================

function updateStatistik(){

    document.getElementById("jumlahProduk").textContent =
    semuaProduk.length;

    const daftarUmkm = [

        ...new Set(

            semuaProduk.map(item => item.nama_umkm)

        )

    ];

    document.getElementById("jumlahUmkm").textContent =
    daftarUmkm.length;

    const daftarKategori = [

        ...new Set(

            semuaProduk.map(item => item.kategori)

        )

    ];

    document.getElementById("jumlahKategori").textContent =
    daftarKategori.length;

}


// ======================================================
// FILTER KATEGORI
// ======================================================

function tampilkanKategori(){

    const daftarKategori = [

        ...new Set(

            semuaProduk.map(item => item.kategori)

        )

    ];

    const container =
    document.getElementById("kategori-list");

    container.innerHTML = "";

    container.innerHTML += `

        <button
        class="filter-btn active"
        data-kategori="Semua">

            Semua

        </button>

    `;

    daftarKategori.forEach(kategori=>{

        container.innerHTML += `

        <button
        class="filter-btn"
        data-kategori="${kategori}">

            ${kategori}

        </button>

        `;

    });

    document.querySelectorAll(".filter-btn")
    .forEach(button=>{

        button.addEventListener("click",function(){

            document
            .querySelectorAll(".filter-btn")
            .forEach(btn=>btn.classList.remove("active"));

            this.classList.add("active");

            kategoriAktif =
            this.dataset.kategori;

            filterProduk();

        });

    });

}


// ======================================================
// SEARCH + FILTER
// ======================================================

function filterProduk(){

    const keyword =
    document
    .getElementById("searchInput")
    .value
    .toLowerCase();

    const hasil = semuaProduk.filter(item=>{

        const cocokNama =

            item.nama
            .toLowerCase()
            .includes(keyword)

            ||

            item.nama_umkm
            .toLowerCase()
            .includes(keyword);

        const cocokKategori =

            kategoriAktif === "Semua"

            ||

            item.kategori === kategoriAktif;

        return cocokNama && cocokKategori;

    });

    tampilkanProduk(hasil);

}


// ======================================================
// FORMAT NOMOR WA
// ======================================================

function formatWA(no){

    if(!no){

        return "";

    }

    no = no.toString();

    no = no.replace(/\D/g,"");

    if(no.startsWith("0")){

        no = "62" + no.substring(1);

    }

    return no;

}


// ======================================================
// CONVERT LINK GOOGLE DRIVE
// ======================================================

function convertDriveLink(link){

    if(!link){

        return "https://placehold.co/600x400?text=Foto";

    }

    const match = link.match(/\/d\/(.*?)\//);

    if(match){

        return `https://drive.google.com/thumbnail?id=${match[1]}&sz=w1000`;

    }

    return link;

}

// ======================================================
// TAMPILKAN PRODUK
// ======================================================

function tampilkanProduk(data){

    const container = document.getElementById("product-list");

    container.innerHTML = "";

    if(data.length === 0){

        container.innerHTML = `

        <div class="col-12 text-center py-5">

            <h5>Tidak ada produk ditemukan.</h5>

        </div>

        `;

        return;

    }

    data.forEach(item=>{

        container.innerHTML += `

        <div class="col-lg-4 col-md-6 mb-4">

            <div class="card product-card h-100">

                <img
                    src="${convertDriveLink(item.foto)}"
                    class="card-img-top"
                    alt="${item.nama}"
                    onerror="this.src='https://placehold.co/600x400?text=Foto+Produk'">

                <div class="card-body d-flex flex-column">

                    <span class="category">

                        ${item.kategori}

                    </span>

                    <h5>

                        ${item.nama}

                    </h5>

                    <p class="umkm-name">

                        🏪 ${item.nama_umkm}

                    </p>

                    <p class="product-description">

                        ${item.deskripsi}

                    </p>

                    <div class="price">

                        Rp ${Number(item.harga).toLocaleString("id-ID")}

                    </div>

                    <a
                    href="detail.html?id=${item.id}"
                    class="btn btn-success w-100">

                        Lihat Detail

                    </a>

                </div>

            </div>

        </div>

        `;

    });

}




// ======================================================
// SEARCH
// ======================================================

document
.getElementById("searchInput")
.addEventListener("input",filterProduk);


// ======================================================
// START
// ======================================================

loadData();