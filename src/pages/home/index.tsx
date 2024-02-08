import { Divider } from 'antd';
import styles from 'styles/client/client.module.scss';
import SearchClient from '@/components/client/search.client';
import JobCard from '@/components/client/card/job.card';
import CompanyCard from '@/components/client/card/company.card';
import { useState } from 'react';
import { useAppSelector } from '@/redux/hooks';

const HomePage = () => {
    const [searchJob, setSearchJob] = useState({});

    return (
        <div className={`${styles["container"]} ${styles["home-section"]}`}>
            <div className="search-content" style={{ marginTop: 20 }}>
                <SearchClient searchJob={searchJob} setSearchJob={setSearchJob} />
            </div>
            <Divider />
            <CompanyCard />
            <div style={{ margin: 50 }}></div>
            <Divider />
            <JobCard searchJob={searchJob} setSearchJob={setSearchJob} />
        </div>
    )
}

export default HomePage;