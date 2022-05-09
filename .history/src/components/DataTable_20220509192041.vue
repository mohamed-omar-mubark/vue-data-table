<template>
    <section class="data-table-section">
        <div class="component-heading">
            <span class="title">Users</span>
        </div>

        <!-- Search input -->
        <div class="search">
            <div class="form-group position-relative">
                <div class="icon position-absolute d-flex justify-content-center align-items-center">
                    <i class="fa-solid fa-magnifying-glass"></i>
                </div>
                <input type="text" class="form-control" placeholder="search..." v-model="usersSearch">
            </div>
        </div>

        <!-- users table -->
        <div class="table-responsive">
            <table class="table primary-table">
                <thead>
                    <tr>
                        <th scope="col">Name</th>
                        <!-- <th scope="col">Email</th>
                        <th scope="col">Phone</th> -->
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="user in filteredUserss.slice(start, end)" :key="user.id">
                        <td><span class="f-s-14 f-w-400 dark-color">{{ user.name }}</span></td>
                        <!-- <td><span class="f-s-14 f-w-400 dark-color">{{ user.email }}</span></td>
                        <td><span class="f-s-14 f-w-400 dark-color">{{ user.phone }}</span></td> -->
                    </tr>
                </tbody>
            </table>

            <!-- Loading sppiner -->
            <div class="loading text-center" v-if="users.length == 0">
                <pulse-loader />
            </div>
            
            <!-- Table pagination -->
            <div class="pagination">
                <ul class="pages-list d-flex justify-content-start align-items-center gap-2">
                    <!-- li pagination button will be here -->
                </ul>
            </div>
        </div>
    </section>
</template>

<script>
// Import pulse-loader
import PulseLoader from "vue-spinner/src/PulseLoader.vue";

export default {
    name: "DataTable",
    components: {
        PulseLoader,
    },
    data() {
        return {
            // How meny items in single table page
            tablePageLimit: 3,

            // How meny table pages
            tablePages: null,

            // Table first page number
            pageNumber: 1,
            
            // "start" and "end" values to slice users array
            start: 0,
            end: 3, // Must be equal tablePageLimit value

            // users array
            users: [],

            // Patient search
            usersSearch: "",
        }
    },
    mounted() {
        // Get all users from "jsonplaceholder" free fake api:
        this.axios.get(`https://jsonplaceholder.typicode.com/posts`).then((response) => {

            // Get function start time:
            const startTime = performance.now();

            // Appent response data to users array:
            this.users = response.data;

            // Get function duration time:
            const duration = performance.now() - startTime;
            
            setTimeout(() => {
                // Calculate number of table pages:
                this.tablePages = this.users.length / this.tablePageLimit;
                
                for (let i = 0; i < this.tablePages; i++) {
                    // Create li pagination buttons:
                    // Create an "li":
                    const li = document.createElement("li");

                    // Add class to pagination li:
                    li.classList.add("pagination-btn");

                    // Add text in pagination li:
                    const liText = document.createTextNode(this.pageNumber++);

                    // Append text to pagination li:
                    li.appendChild(liText);

                    // Set attribute value and id to li:
                    li.setAttribute("value", li.innerText);
                    li.setAttribute("id", "pagination-btn");

                    // Append the "li" element to the list:
                    document.querySelector(".pages-list").appendChild(li);

                    li.addEventListener("click", () => {
                        this.end = li.value * this.tablePageLimit;
                        this.start = this.end - this.tablePageLimit;
                    })
                }

                // Select the first pagination li:
                let firstLi = document.getElementById("pagination-btn");
                // Set class active to the first pagination li:
                firstLi.classList.add("active");

                // Select all of pagination li:
                let paginationLis = document.querySelectorAll("#pagination-btn");

                // loop on all pagination li:
                paginationLis.forEach(singleLi => {

                    // Add event listener "click" to all pagination li:
                    singleLi.addEventListener("click", () => {

                        // Remove class "active" from all pagination li:
                        paginationLis.forEach(element => {
                            element.classList.remove("active");
                        });

                        // Add class "active" to the latest clicked li:
                        singleLi.classList.add("active");
                    });
                });

            }, duration); // Duration of axios request
        })
        .catch((error) => {
            console.log(error);
        });
    },
    computed: {
        // Filter users by (name, email and phone number):
        filteredUsers() {
            return this.users.filter((patient) => {
                return this.usersSearch.toLowerCase().split(' ').every(v => patient.name.toLowerCase().includes(v)) || 
                this.usersSearch.toLowerCase().split(' ').every(v => patient.email.toLowerCase().includes(v)) || 
                this.usersSearch.toLowerCase().split(' ').every(v => patient.phone.toLowerCase().includes(v));
            });
        }
    },
}
</script>

<style lang="scss">
// Import scss data table style file:
@import "../scss/_data-table.scss";
</style>