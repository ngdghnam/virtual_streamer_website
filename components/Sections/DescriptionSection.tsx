import React from "react";
import Image from "next/image";
import Header from "../Header";

const DescriptionSection = () => {
  return (
    <div className="mt-6 p-4 bg-white shadow-lg rounded-lg mx-1">
      <Header></Header>
      <div className="my-1">
        <h1 className="text-xl font-bold mb-1">Giới thiệu</h1>
        <p className="text-xl font-bold">
          “Thần tượng ảo – hay còn gọi được là virtual idol – là những nhân vật
          không phải người thật, nhưng lại có thể ca hát, nhảy múa, quảng bá sản
          phẩm hoặc xuất hiện trên mạng xã hội như một người nổi tiếng.”
        </p>
        <p className="text-[16px] mt-0.5">
          Trước khi chúng ta bắt đầu khảo sát, mình sẽ giúp bạn hiểu rõ hơn về
          hai loại thần tượng ảo đang được quan tâm hiện nay nhé!
        </p>
        <h1 className="font-medium text-xl mt-2">Phân biệt CVA và FVI</h1>
        <p>Hiện nay, có hai dạng thần tượng ảo phổ biến</p>
        <div className="mt-1">
          <p className="font-medium">1. Celeb Virtual Avatar (CVA)</p>
          <p>
            Đây là những thần tượng ảo được xây dựng dựa trên người nổi tiếng có
            thật. Họ có gương mặt, phong cách hoặc giọng nói mô phỏng từ phiên
            bản ngoài đời.
          </p>
          <div className="flex flex-wrap justify-center text-center gap-2 mt-2.5">
            <div>
              {/* Left */}
              <Image
                src="/images/CVA/aeaespa.png"
                width={600}
                height={400}
                alt="Cleber Virtual Avatar ae aespa"
                className="rounded-lg mb-0.5"
              ></Image>
              Nhóm thần tượng ảo ae dựa trên nhóm thần tượng thật aespa
            </div>

            <div>
              {/* Right */}
              <Image
                src="/images/CVA/TocTienAI.png"
                width={600}
                height={400}
                alt="Cleber Virtual Avatar Toc Tien AI"
                className="rounded-lg mb-0.5"
              ></Image>
              Tóc Tiên AI dựa trên nữ ca sĩ Tóc Tiên
            </div>
          </div>
        </div>

        <div className="mt-2.5">
          <p className="font-medium">2. Fully Virtual Idol (FVI)</p>
          <p>
            FVI là thần tượng ảo hoàn toàn hư cấu, không đại diện cho người
            thật. Ngoại hình, tính cách, giọng nói và hành vi của họ được tạo ra
            bằng công nghệ như AI và đồ họa máy tính. FVI tồn tại độc lập như
            một thực thể kỹ thuật số.
          </p>
          <div className="flex flex-wrap justify-center text-center gap-2 mt-2.5">
            <div>
              {/* Left */}
              <Image
                src="/images/FVI/HatsuneMiku.png"
                width={600}
                height={400}
                alt="Virtual idol Hatsune Miku"
                className="rounded-lg mb-0.5"
              ></Image>
              Thần tượng ảo Hatsune Miku
            </div>

            <div>
              {/* Right */}
              <Image
                src="/images/FVI/LilMiquelaFVI.png"
                width={600}
                height={400}
                alt="Virtual idol Lil Miquela"
                className="rounded-lg mb-0.5"
              ></Image>
              Thần tượng ảo Lil Miquela.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DescriptionSection;
