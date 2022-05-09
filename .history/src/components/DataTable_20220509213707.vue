<template>
    <section class="data-table-section">
        <div class="component-heading">
            <span class="title">Users</span>
        </div>

        <!-- Search input -->
        <div class="search">
            <div class="form-group">
                <div class="icon">
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
                        <th scope="col">ID</th>
                        <th scope="col">Title</th>
                        <th scope="col">Description</th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="user in filteredUsers.slice(start, end)" :key="user.id">
                        <td><span>{{ user.id }}</span></td>
                        <td><span>{{ user.title }}</span></td>
                        <td><span>{{ user.body }}</span></td>
                    </tr>
                </tbody>
            </table>

            <!-- Loading sppiner -->
            <div class="loading text-center" v-if="users.length == 0">
                <pulse-loader />
            </div>
            
            <!-- Table pagination -->
            <div class="pagination">
                <div class="entries-number">
                    <span>Show {{ tablePageLimit }} of {{ users.length }} entries</span>
                </div>
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
            tablePageLimit: 10,

            // How meny table pages
            tablePages: null,

            // Table first page number
            pageNumber: 1,
            
            // "start" and "end" values to slice users array
            start: 0,
            end: 10, // Must be equal tablePageLimit value

            // users array
            users: [],

            // Patient search
            usersSearch: "",
        }
    },
    mounted() {
        // Get all users from "jsonplaceholder" free fake api:
        this.axios.get(`https://jsonplaceholder.typicode.com/posts`).then((response) => {

            // Get append data start time:
            const startTime = performance.now();

            // Append response data to users array:
            this.users = response.data;
            console.log(response.data);

            // Get append data duration time:
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
        // Filter users by (title and body):
        filteredUsers() {
            return this.users.filter((user) => {
                return this.usersSearch.toLowerCase().split(' ').every(v => user.title.toLowerCase().includes(v)) || 
                this.usersSearch.toLowerCase().split(' ').every(v => user.body.toLowerCase().includes(v));
            });
        }
    },
}
</script>

<style lang="scss">
// Import scss data table style file:
@import "../scss/_data-table.scss";
</style>