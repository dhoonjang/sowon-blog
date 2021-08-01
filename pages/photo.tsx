import React, { useEffect, useRef } from "react";
import { GetServerSideProps } from "next";
import Layout, { imageInputProps } from "../src/components/Layout";
import Home from "../src/components/Home";
import prisma from "../src/lib/prisma";
import { IPhotoSummary } from "src/context/feed";
import { fileRequestConfig } from "src/lib/axios";
import axios from "axios";
import { useState } from "react";
import { useRouter } from "next/router";
import { useRecoilValue } from "recoil";
import authState from "src/context/auth";
import moment from "moment";

export const getServerSideProps: GetServerSideProps = async () => {
  const photos = await prisma.photoSummary.findMany();

  return {
    props: {
      photos: photos.map((p) => ({
        ...p,
        createdAt: p.createdAt.toString(),
        updatedAt: p.updatedAt.toString(),
      })),
    },
  };
};

export interface IPhotoPageProps {
  photos: IPhotoSummary[];
}

const PhotoPage: React.FC<IPhotoPageProps> = ({ photos }) => {
  const isLogin = useRecoilValue(authState);
  const router = useRouter();
  const summaryRef = useRef<HTMLTextAreaElement>(null);
  const imgRef = useRef<HTMLInputElement>(null);

  const [cFileList, setCFileList] = useState<FileList | null>(null);

  const onChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (!event.target.files?.length) setCFileList(null);
    setCFileList(event.target.files);
  };

  const submitFunc = async () => {
    if (!cFileList || !summaryRef.current) return;

    const formData = new FormData();

    Array.from(cFileList).forEach((file) => {
      formData.append("photoImg", file);
    });

    formData.append("summary", summaryRef.current.value);

    const response = await axios.post(
      `/api/upload/photoImg`,
      formData,
      fileRequestConfig
    );

    if (response.status === 200) {
      router.replace(router.asPath);
    }

    if (imgRef.current) imgRef.current.value = "";
    if (summaryRef.current) summaryRef.current.value = "";
    setCFileList(null);
  };

  const deleteFunc = async (id: number) => {
    const response = await axios.delete("/api/upload/photoImg", {
      params: { id },
    });
    if (response.status === 200) {
      router.replace(router.asPath);
    }
  };

  return (
    <Layout>
      <input
        name="photoImg"
        ref={imgRef}
        onChange={onChange}
        multiple
        {...imageInputProps}
      />
      {isLogin &&
        (cFileList ? (
          <div className="submit-area">
            <div className="file-list">
              {Array.from(cFileList).map((f) => (
                <div className="file">{f.name}</div>
              ))}
            </div>
            <textarea ref={summaryRef} placeholder="설명" />
            <button onClick={submitFunc}>확인</button>
          </div>
        ) : (
          <button onClick={() => imgRef.current.click()}>사진 올리기</button>
        ))}
      <div className="photo-grid">
        {photos
          .sort((a, b) => moment(b.createdAt).diff(a.createdAt))
          .map((p) => (
            <div className="photo">
              <img src={p.imageUrl} alt="" />
              <div className="summary">{p.summary}</div>
              {isLogin && (
                <button onClick={() => deleteFunc(p.id)}>삭제</button>
              )}
            </div>
          ))}
      </div>
    </Layout>
  );
};

export default PhotoPage;
