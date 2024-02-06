import { useLocation, useNavigate } from "react-router-dom";
import { useState, useEffect } from 'react';
import { IJob } from "@/types/backend";
import { callFetchJobById } from "@/config/api";
import styles from 'styles/client/client.module.scss';
import parse from 'html-react-parser';
import { Col, Divider, Row, Skeleton, Tag } from "antd";
import { DollarOutlined, EnvironmentOutlined, HistoryOutlined } from "@ant-design/icons";
import { convertSlug, getLocationName } from "@/config/utils";
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import ApplyModal from "@/components/client/modal/apply.modal";
import { Link } from "react-router-dom";
dayjs.extend(relativeTime)


const ClientJobDetailPage = (props: any) => {
    const [jobDetail, setJobDetail] = useState<IJob | null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(false);

    const [isModalOpen, setIsModalOpen] = useState<boolean>(false);

    let location = useLocation();
    const navigate = useNavigate();
    let params = new URLSearchParams(location.search);
    const id = params?.get("id"); // job id

    useEffect(() => {
        const init = async () => {
            if (id) {
                setIsLoading(true)
                const res = await callFetchJobById(id);
                if (res?.data) {
                    setJobDetail(res.data)
                }
                setIsLoading(false)
            }
        }
        init();
    }, [id]);

    const handleViewDetailJob = (item: IJob) => {
        const slug = convertSlug(item.company?.name ?? '');
        return `/company/${slug}?id=${item.company?._id}`
    }

    return (
        <div className={`${styles["container"]} ${styles["detail-job-section"]}`}>
            {isLoading ?
                <Skeleton />
                :
                <Row gutter={[20, 20]}>
                    {jobDetail && jobDetail._id &&
                        <>
                            <Col span={24} md={16}>
                                <div className={styles["header"]}>
                                    {jobDetail.name}
                                </div>
                                <div>
                                    <button
                                        onClick={() => setIsModalOpen(true)}
                                        className={styles["btn-apply"]}
                                    >Apply Now</button>
                                </div>
                                <Divider />
                                <div className={styles["skills"]}>
                                    {jobDetail?.skills?.map((item, index) => {
                                        return (
                                            <Tag key={`${index}-key`} color="gold" >
                                                {item}
                                            </Tag>
                                        )
                                    })}
                                </div>
                                <div className={styles["salary"]}>
                                    <DollarOutlined />
                                    <span>&nbsp;{(jobDetail.salary + "")?.replace(/\B(?=(\d{3})+(?!\d))/g, ',')} đ</span>
                                </div>
                                <div className={styles["location"]}>
                                    <EnvironmentOutlined style={{ color: '#58aaab' }} />&nbsp;{getLocationName(jobDetail.location)}
                                </div>
                                <div>
                                    <HistoryOutlined /> Số lượng tuyển: {jobDetail.quantity} người
                                </div>
                                <Divider />
                                {parse(jobDetail.description)}
                            </Col>

                            <Col span={24} md={8}>
                                <Link
                                    to={handleViewDetailJob(jobDetail)}
                                    // style={{ cursor: 'pointer' }}
                                    // onClick={() => handleViewDetailJob(jobDetail)}
                                    className={styles["company"]}
                                >
                                    <div>
                                        <img
                                            alt="example"
                                            src={`${import.meta.env.VITE_BACKEND_URL}/images/company/${jobDetail.company?.logo}`}
                                        />
                                    </div>
                                    <div className={styles["company-name"]}>
                                        {jobDetail.company?.name}
                                    </div>
                                </Link>
                            </Col>
                        </>
                    }
                </Row>
            }
            <ApplyModal
                isModalOpen={isModalOpen}
                setIsModalOpen={setIsModalOpen}
                jobDetail={jobDetail}
            />
        </div>
    )
}
export default ClientJobDetailPage;