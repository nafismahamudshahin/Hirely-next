import JobDetails from "@/components/browse-jobs/JobDetails";
import Footer from "@/components/layout/Footer";
import Navbar from "@/components/layout/Navbar";

export default function BrowseJobDetailsPage() {
    return (
        <>
            <Navbar></Navbar>
            <JobDetails />
            <Footer></Footer>
        </>
    )
}
