// ======================================================
// API
// ======================================================

const API_URL =
"https://script.google.com/macros/s/AKfycbxkRGQ-MBt1hgHs1zppZEgGbeKBji4Snj0zTLr3JA7RxOi44M7t1OtYXgdY0wlqtvJW/exec";


// ======================================================
// AMBIL ID PRODUK DARI URL
// ======================================================

const params = new URLSearchParams(window.location.search);

const idProduk = params.get("id");


// ======================================================
// LOAD DETAIL
// ======================================================

async function loadDetail(){

    try{

        const response = await fetch(API_URL);

        const data = await response.json();


        const semuaProduk = data.filter(item =>

            item.status &&
            item.status.trim().toLowerCase() === "aktif"

        );


        const produk = semuaProduk.find(item =>

            item.id == idProduk

        );


        if(!produk){

            document.querySelector(".container").innerHTML = `

            <div class="text-center py-5">

                <h3>
                    Produk tidak ditemukan
                </h3>

                <a href="index.html"
                class="btn btn-success mt-3">

                    Kembali

                </a>

            </div>

            `;

            return;

        }


        tampilkanDetail(produk);


        tampilkanProdukLain(
            semuaProduk,
            produk.nama_umkm,
            produk.id
        );


    }

    catch(error){

        console.error(
            "Gagal mengambil detail:",
            error
        );

    }

}




// ======================================================
// TAMPIL DETAIL PRODUK
// ======================================================

function tampilkanDetail(produk){


    document.getElementById("detailFoto").src =
    convertDriveLink(produk.foto);


    document.getElementById("detailFoto").alt =
    produk.nama;



    document.getElementById("detailKategori").textContent =
    produk.kategori;



    document.getElementById("detailNama").textContent =
    produk.nama;



    document.getElementById("detailUmkm").innerHTML =
    "🏪 " + produk.nama_umkm;



   const harga = String(produk.harga).trim();

    document.getElementById("detailHarga").textContent =
        /^\d+$/.test(harga)
            ? "Rp " + Number(harga).toLocaleString("id-ID")
            : harga;



    document.getElementById("detailDeskripsi").textContent =
    produk.deskripsi;



    const nomorWA = formatWA(produk.wa);

    const pesan = 
    `Halo, saya melihat produk *${produk.nama}* pada Website E-Katalog UMKM Desa Sriwedari. Apakah produk tersebut masih tersedia?`;

    document.getElementById("btnWA").href =
    `https://wa.me/${nomorWA}?text=${encodeURIComponent(pesan)}`;

}



// ======================================================
// PRODUK LAIN DARI UMKM SAMA
// ======================================================

function tampilkanProdukLain(
    data,
    namaUmkm,
    idSekarang
){

    const container =
    document.getElementById("produkLain");


    const produkLain = data.filter(item =>

        item.nama_umkm === namaUmkm &&
        item.id != idSekarang

    );



    if(produkLain.length === 0){

        container.innerHTML = `

        <p>
            Tidak ada produk lain.
        </p>

        `;

        return;

    }



    container.innerHTML = "";



    produkLain.forEach(item=>{


        container.innerHTML += `


        <div class="col-lg-4 col-md-6 mb-4">


            <div class="card product-card h-100">


                <img

                src="${convertDriveLink(item.foto)}"

                class="card-img-top"

                style="height:220px;object-fit:cover"

                onerror="this.src='https://placehold.co/600x400?text=Foto+Produk'"

                >



                <div class="card-body">


                    <span class="category">

                    ${item.kategori}

                    </span>



                    <h5 class="mt-2">

                    ${item.nama}

                    </h5>



                    <p class="umkm-name">

                    🏪 ${item.nama_umkm}

                    </p>



                    <div class="price">

                        ${
                            !isNaN(item.harga) && item.harga !== ""
                                ? `Rp ${Number(item.harga).toLocaleString("id-ID")}`
                                : item.harga
                        }

                    </div>



                    <a

                    href="detail.html?id=${item.id}"

                    class="btn btn-success w-100 mt-3"

                    >

                    Lihat Detail

                    </a>


                </div>


            </div>


        </div>


        `;


    });


}



// ======================================================
// FORMAT WA
// ======================================================

function formatWA(no){

    if(!no){

        return "";

    }


    no = String(no)
    .replace(/\D/g,"");


    // Jika nomor diawali 0
    if(no.startsWith("0")){

        no = "62" + no.substring(1);

    }


    // Jika diawali 8 langsung
    if(no.startsWith("8")){

        no = "62" + no;

    }


    // Jika diawali 62 sudah aman
    return no;

}



// ======================================================
// GOOGLE DRIVE IMAGE
// ======================================================

function convertDriveLink(link){

    if(!link){

        return "https://placehold.co/600x400?text=Foto";

    }


    const match =
    link.match(/\/d\/(.*?)\//);



    if(match){

        return `https://drive.google.com/thumbnail?id=${match[1]}&sz=w1000`;

    }


    return link;

}




// ======================================================
// START
// ======================================================

loadDetail();