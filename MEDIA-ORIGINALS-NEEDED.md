# Media files where the original is needed

Squarespace's image CDN never serves more than **2500 px wide**, regardless of the uploaded size. Every image below was uploaded larger than that, so the copy in `src/assets/media/` is a downscaled rendition. Drop the original file over the downloaded one (same file name, in `src/assets/media/`) and the build will pick it up automatically.

- Unique images on the site: **182** (110.7 MB downloaded)
- Served at full original size: **46**
- Served downscaled — original needed: **136**
- Video: **1** — see below

## Video (original file needed)

| File | What we have | Original |
|---|---|---|
| `public/video/what-carries-behind.mp4` (page “What Carries Behind”) | Squarespace's transcoded 1080×1920 H.264 stream, remuxed losslessly to MP4 (24 MB, 72 s) | Squarespace only exposes the transcoded HLS stream, not the uploaded file. Replace with the original export if a higher-quality master exists. |

## Images (136)

| Local file | Original filename on Squarespace | Uploaded size | Size we could get | Used on |
|---|---|---|---|---|
| `background.jpg` | background.jpg | 6048×4024 | 2500×1663 | Home |
| `break-away-clear-backgrond.jpg` | Break+Away+clear+backgrond.jpg | 5397×2500 | 2500×1158 | Work: Breakaway |
| `break-away.jpg` | Break+Away.jpg | 13511×1522 | 2500×282 | Work: Breakaway |
| `breath-5748.jpg` | breath-5748.jpg | 4000×5026 | 2500×3141 | Work: Caring |
| `breath-5755.jpg` | breath-5755.jpg | 4000×4694 | 2500×2934 | Work: Caring |
| `breath-5759.jpg` | breath-5759.jpg | 4000×4915 | 2500×3072 | Work: Caring |
| `breath-5763.jpg` | breath-5763.jpg | 4000×6000 | 2500×3750 | Work: Caring |
| `breath-5765.jpg` | breath-5765.jpg | 3891×5508 | 2500×3539 | Work: Caring |
| `breath-5780-e98bc1.jpg` | breath-5780.jpg | 3069×4102 | 2500×3341 | Works index |
| `breath-5784.jpg` | breath-5784.jpg | 5676×3827 | 2500×1686 | Work: Breath |
| `breath-5786.jpg` | breath-5786.jpg | 6000×4000 | 2500×1667 | Work: Breath |
| `breath-5787.jpg` | breath-5787.jpg | 6000×4000 | 2500×1667 | Work: Breath |
| `breath-5789.jpg` | breath-5789.jpg | 6000×4000 | 2500×1667 | Work: Breath |
| `carring-blossom-10.jpg` | carring+blossom-10.jpg | 6048×4024 | 2500×1663 | Works index, Work: Untitled, Exhibition: From Mud to Bloom |
| `carring-blossom-11-43bf40.jpg` | carring+blossom-11.jpg | 6048×4024 | 2500×1663 | Work: Untitled, Exhibition: From Mud to Bloom |
| `carring-blossom-11-82acac.jpg` | carring+blossom-11.jpg | 6048×4024 | 2500×1663 | Exhibition: From Mud to Bloom |
| `carring-blossom-12.jpg` | carring+blossom-12.jpg | 6048×4024 | 2500×1663 | Work: Untitled, Exhibition: From Mud to Bloom |
| `carring-blossom-13-2230b3.jpg` | carring+blossom-13.jpg | 6048×4024 | 2500×1663 | Exhibition: Chrysalis |
| `carring-blossom-13-f4698d.jpg` | carring+blossom-13.jpg | 6048×4024 | 2500×1663 | Exhibition: From Mud to Bloom |
| `carring-blossom-2-3830ff.jpg` | carring+blossom-2.jpg | 6048×4024 | 2500×1663 | Work: Did I jump, or was I pushed to be a filial daughter?, Exhibition: From Mud to Bloom |
| `carring-blossom-2-65e596.jpg` | carring+blossom-2.jpg | 6048×4024 | 2500×1663 | Exhibition: Chrysalis |
| `carring-blossom-2-963f5b.jpg` | carring+blossom-2.jpg | 6048×4024 | 2500×1663 | Exhibition: From Mud to Bloom |
| `carring-blossom-2-a67906.jpg` | carring+blossom-2.jpg | 6048×4024 | 2500×1663 | Works index, Work: Last Bloom, Exhibition: From Mud to Bloom |
| `carring-blossom-2-bdf55d.jpg` | carring+blossom-2.jpg | 6048×4024 | 2500×1663 | Work: Blue Tears, Exhibition: From Mud to Bloom |
| `carring-blossom-3-4af8e6.jpg` | carring+blossom-3.jpg | 6048×4024 | 2500×1663 | Exhibition: From Mud to Bloom |
| `carring-blossom-3-76ebb6.jpg` | carring+blossom-3.jpg | 6048×4024 | 2500×1663 | Exhibition: From Mud to Bloom |
| `carring-blossom-3-870179.jpg` | carring+blossom-3.jpg | 6048×4024 | 2500×1663 | Work: Karma, Exhibition: From Mud to Bloom |
| `carring-blossom-4-18eeca.jpg` | carring+blossom-4.jpg | 6048×4024 | 2500×1663 | Work: Did I jump, or was I pushed to be a filial daughter?, Exhibition: From Mud to Bloom |
| `carring-blossom-4-b9e570.jpg` | carring+blossom-4.jpg | 6048×4024 | 2500×1663 | Exhibition: Chrysalis |
| `carring-blossom-5-6e3c63.jpg` | carring+blossom-5.jpg | 6048×4024 | 2500×1663 | Works index |
| `carring-blossom-5-a4e480.jpg` | carring+blossom-5.jpg | 6048×4024 | 2500×1663 | Work: Did I jump, or was I pushed to be a filial daughter?, Exhibition: From Mud to Bloom |
| `carring-blossom-5-copy.jpg` | carring+blossom-5+copy.jpg | 6048×4024 | 2500×1663 | Work: Untitled, Exhibition: From Mud to Bloom |
| `carring-blossom-6-copy.jpg` | carring+blossom-6+copy.jpg | 6048×4024 | 2500×1663 | Work: Untitled, Exhibition: From Mud to Bloom |
| `carring-blossom-6ce4e0.jpg` | carring+blossom.jpg | 6048×4024 | 2500×1663 | Work: What is Left Behind? |
| `carring-blossom-7-06a846.jpg` | carring+blossom-7.jpg | 6048×4024 | 2500×1663 | Exhibition: From Mud to Bloom |
| `carring-blossom-7-4e4ab9.jpg` | carring+blossom-7.jpg | 6048×4024 | 2500×1663 | Works index, Work: Untitled, Exhibition: From Mud to Bloom |
| `carring-blossom-7-8aa0fd.jpg` | carring+blossom-7.jpg | 6048×4024 | 2500×1663 | Exhibition: Chrysalis |
| `carring-blossom-7d3b8e.jpg` | carring+blossom.jpg | 6048×4024 | 2500×1663 | Works index, Work: Blue Tears, Exhibition: From Mud to Bloom |
| `carring-blossom-8-8526e7.jpg` | carring+blossom-8.jpg | 6048×4024 | 2500×1663 | Exhibition: From Mud to Bloom |
| `carring-blossom-8-be4de1.jpg` | carring+blossom-8.jpg | 6048×4024 | 2500×1663 | Work: Untitled, Exhibition: From Mud to Bloom |
| `carring-blossom-8-e6232a.jpg` | carring+blossom-8.jpg | 6048×4024 | 2500×1663 | Exhibition: Chrysalis |
| `carring-blossom-83e036.jpg` | carring+blossom.jpg | 6048×4024 | 2500×1663 | Exhibition: From Mud to Bloom |
| `carring-blossom-9-f3ce21.jpg` | carring+blossom-9.jpg | 6048×4024 | 2500×1663 | Work: Untitled, Exhibition: From Mud to Bloom |
| `carring-blossom-9-f44ca8.jpg` | carring+blossom-9.jpg | 6048×4024 | 2500×1663 | Exhibition: Chrysalis |
| `carring-blossom-9-ffd2cb.jpg` | carring+blossom-9.jpg | 6048×4024 | 2500×1663 | Exhibition: From Mud to Bloom |
| `carring-blossom-be354a.jpg` | carring+blossom.jpg | 6048×4024 | 2500×1663 | Work: The Weight of Blossom |
| `carring-blossom-cc6022.jpg` | carring+blossom.jpg | 6048×4024 | 2500×1663 | Works index |
| `carring-blossom-copy.jpg` | carring+blossom+copy.jpg | 6048×4024 | 2500×1663 | Work: Karma, Exhibition: From Mud to Bloom |
| `carring-blossom-f150c7.jpg` | carring+blossom.jpg | 6048×4024 | 2500×1663 | Exhibition: From Mud to Bloom |
| `carring-blossom-f45ff4.jpg` | carring+blossom.jpg | 6048×4024 | 2500×1663 | Exhibition: Chrysalis |
| `clay-chicken-with-net.jpg` | clay+chicken+with+net.jpeg | 3481×2568 | 2500×1844 | Work: Rebirth |
| `dsc-0396.jpg` | DSC_0396.JPEG | 2848×3467 | 2500×3043 | Work: Breakaway |
| `dsc-0398.jpg` | DSC_0398.JPEG | 2848×4288 | 2500×3764 | Work: Breakaway |
| `dsc-0399.jpg` | DSC_0399.JPEG | 4288×2848 | 2500×1660 | Work: Breakaway |
| `dsc-0445.jpg` | DSC_0445.JPEG | 4288×2848 | 2500×1660 | Work: Breakaway |
| `dsc-3293.jpg` | DSC_3293.jpg | 6048×4024 | 2500×1663 | Works index, Exhibition: Chrysalis |
| `dsc-3295.jpg` | DSC_3295.jpg | 6048×4024 | 2500×1663 | Works index, Exhibition: Chrysalis |
| `dsc-3297.jpg` | DSC_3297.jpg | 6048×4024 | 2500×1663 | Works index, Exhibition: Chrysalis |
| `dsc-3308.jpg` | DSC_3308.jpg | 6048×4024 | 2500×1663 | Exhibition: Chrysalis |
| `dsc-3309.jpg` | DSC_3309.jpg | 6048×4024 | 2500×1663 | Exhibition: Chrysalis |
| `dsc-3316.jpg` | DSC_3316.jpg | 4024×6048 | 2500×3757 | Works index |
| `dsc-3320.jpg` | DSC_3320.jpg | 4024×6048 | 2500×3757 | Exhibition: Chrysalis |
| `dsc-3323.jpg` | DSC_3323.jpg | 4024×6048 | 2500×3757 | Exhibition: Chrysalis |
| `dsc-3326.jpg` | DSC_3326.jpg | 6048×4024 | 2500×1663 | Exhibitions index, Exhibition: Chrysalis |
| `dsc-3331-c04298.jpg` | DSC_3331.jpg | 6048×4024 | 2500×1663 | Exhibition: Chrysalis |
| `dsc-3331-e5509f.jpg` | DSC_3331.jpg | 6048×4024 | 2500×1663 | Works index |
| `dsc-4073.jpg` | DSC_4073.jpg | 5890×3919 | 2500×1663 | Work: What Carries Behind |
| `dsc-4078-1-9f55e0.jpg` | DSC_4078+(1).jpg | 6048×4024 | 2500×1663 | Works index |
| `dsc-4078-1-c2a0a0.jpg` | DSC_4078+(1).jpg | 6048×4024 | 2500×1663 | Work: What Carries Behind |
| `dsc-9822-4303af.jpg` | DSC_9822.jpg | 6048×4024 | 2500×1663 | Exhibition: From Mud to Bloom |
| `dsc-9822-c60ddc.jpg` | DSC_9822.jpg | 6048×4024 | 2500×1663 | Work: The Weight of Blossom |
| `dsc-9824.jpg` | DSC_9824.jpg | 6048×4024 | 2500×1663 | Work: The Weight of Blossom, Exhibition: From Mud to Bloom |
| `dsc-9839.jpg` | DSC_9839.jpg | 6048×4024 | 2500×1663 | Work: The Weight of Blossom, Exhibition: From Mud to Bloom |
| `dsc-9841.jpg` | DSC_9841.jpg | 6048×4024 | 2500×1663 | Exhibition: From Mud to Bloom |
| `dsc-9905-234a5e.jpg` | DSC_9905.jpg | 6048×4024 | 2500×1663 | Work: Karma |
| `dsc-9924.jpg` | DSC_9924.jpg | 6048×4024 | 2500×1663 | Exhibition: From Mud to Bloom |
| `dsc-9930-510617.jpg` | DSC_9930.jpg | 6048×4024 | 2500×1663 | Exhibition: From Mud to Bloom |
| `dsc-9939.jpg` | DSC_9939.jpg | 6048×4024 | 2500×1663 | Exhibition: From Mud to Bloom |
| `dsc-9951.jpg` | DSC_9951.jpg | 6048×4024 | 2500×1663 | Exhibition: From Mud to Bloom |
| `dsc-9961.jpg` | DSC_9961.jpg | 6048×4024 | 2500×1663 | Work: The Weight of Blossom |
| `eomma-0340.jpg` | 엄마-0340.jpg | 3795×5683 | 2500×3744 | Works index, Work: Karma |
| `figurre.jpg` | figurre.jpg | 4032×2268 | 2500×1406 | Work: Cloud[ies] |
| `filial-daughter-folktale-2.jpg` | Filial+Daughter+Folktale_2.jpg | 6048×4024 | 2500×1663 | Work: Did I jump, or was I pushed to be a filial daughter? |
| `img-0286.jpg` | IMG_0286.jpg | 3950×4170 | 2500×2639 | Work: What Carries Behind |
| `img-0886-2.jpg` | IMG_0886+2.jpg | 3024×4032 | 2500×3333 | Work: Vulnerable |
| `img-0952.jpg` | IMG_0952.jpg | 3024×4032 | 2500×3333 | Work: Vulnerable |
| `img-0955.jpg` | IMG_0955.jpg | 4284×5712 | 2500×3333 | Work: Vulnerable |
| `img-1334.jpg` | IMG_1334.jpg | 2731×4032 | 2500×3691 | Work: Burden |
| `img-1336-2.jpg` | IMG_1336+2.jpg | 4284×5712 | 2500×3333 | Work: Burden |
| `img-1337.jpg` | IMG_1337.jpg | 4284×5712 | 2500×3333 | Work: Burden |
| `img-1338-2.jpg` | IMG_1338+2.jpg | 4284×5712 | 2500×3333 | Work: Burden |
| `img-6129.jpg` | IMG_6129.jpg | 4284×5712 | 2500×3333 | Work: The Little Prince (incense holder) |
| `img-6681.jpg` | IMG_6681.jpg | 3738×5042 | 2500×3372 | Work: The Little Prince (incense holder) |
| `img-6682.jpg` | IMG_6682.jpg | 3615×4839 | 2500×3346 | Work: The Little Prince (incense holder) |
| `img-6683.jpg` | IMG_6683.jpg | 3929×5184 | 2500×3299 | Work: The Little Prince (incense holder) |
| `img-6684.jpg` | IMG_6684.jpg | 4284×5712 | 2500×3333 | Work: The Little Prince (incense holder) |
| `install.jpg` | install-.jpg | 6048×4024 | 2500×1663 | Works index |
| `jokja-0468.jpg` | 족자-0468.jpg | 6048×4024 | 2500×1663 | Exhibition: From Mud to Bloom |
| `jokja-0478.jpg` | 족자-0478.jpg | 6048×4024 | 2500×1663 | Work: The Weight of Blossom, Exhibition: From Mud to Bloom |
| `jokja-0624.jpg` | 족자-0624.jpg | 6048×4024 | 2500×1663 | Work: The Weight of Blossom, Exhibition: From Mud to Bloom |
| `jokja-9797.jpg` | 족자-9797.jpg | 6048×4024 | 2500×1663 | Work: The Weight of Blossom, Exhibition: From Mud to Bloom |
| `jokja-9915.jpg` | 족자-9915.jpg | 6048×4024 | 2500×1663 | Exhibition: From Mud to Bloom |
| `jokja-9956.jpg` | 족자-9956.jpg | 6048×4024 | 2500×1663 | Works index, Work: Did I jump, or was I pushed to be a filial daughter?, Exhibition: From Mud to Bloom |
| `last-b-0436.jpg` | last+b-0436.jpg | 6048×4024 | 2500×1663 | Work: Last Bloom, Exhibition: From Mud to Bloom |
| `last-b-0437.jpg` | last+b-0437.jpg | 6048×4024 | 2500×1663 | Work: Last Bloom, Exhibition: From Mud to Bloom |
| `last-b-0438.jpg` | last+b-0438.jpg | 6048×4024 | 2500×1663 | Work: Last Bloom, Exhibition: From Mud to Bloom |
| `last-b-0439.jpg` | last+b-0439.jpg | 6048×4024 | 2500×1663 | Work: Last Bloom, Exhibition: From Mud to Bloom |
| `ndm-0418.jpg` | ㄴㄷㅁ-0418.jpg | 6048×4024 | 2500×1663 | Work: Blue Tears, Exhibition: From Mud to Bloom |
| `ndm-0420.jpg` | ㄴㄷㅁ-0420.jpg | 6048×4024 | 2500×1663 | Work: Blue Tears, Exhibition: From Mud to Bloom |
| `ndm-0422.jpg` | ㄴㄷㅁ-0422.jpg | 6048×4024 | 2500×1663 | Exhibition: From Mud to Bloom |
| `ndm-0423.jpg` | ㄴㄷㅁ-0423.jpg | 6048×4024 | 2500×1663 | Work: Blue Tears |
| `ndm-9890.jpg` | ㄴㄷㅁ-9890.jpg | 6048×4024 | 2500×1663 | Work: Blue Tears, Exhibition: From Mud to Bloom |
| `overwhelm.jpg` | Overwhelm.jpg | 3296×2440 | 2500×1851 | Works index |
| `rebirth-yoonseo-lee.jpg` | Rebirth+-+Yoonseo+Lee.jpg | 2935×3194 | 2500×2721 | Work: Rebirth |
| `santa-fe-street.jpg` | Santa+Fe+Street+.jpg | 3912×2626 | 2500×1678 | Works index |
| `seed-0449.jpg` | seed+-0449.jpg | 6048×4024 | 2500×1663 | Work: Untitled, Exhibition: From Mud to Bloom |
| `seed-0450.jpg` | seed+-0450.jpg | 6048×4024 | 2500×1663 | Work: Untitled, Exhibition: From Mud to Bloom |
| `seed-0454.jpg` | seed+-0454.jpg | 6048×4024 | 2500×1663 | Work: Untitled, Exhibition: From Mud to Bloom |
| `seed-0500.jpg` | seed+-0500.jpg | 6048×4024 | 2500×1663 | Work: Untitled, Exhibition: From Mud to Bloom |
| `seed-0501.jpg` | seed+-0501.jpg | 6048×4024 | 2500×1663 | Work: Untitled, Exhibition: From Mud to Bloom |
| `seed-0503.jpg` | seed+-0503.jpg | 6048×4024 | 2500×1663 | Exhibition: From Mud to Bloom |
| `seed-0504.jpg` | seed+-0504.jpg | 6048×4024 | 2500×1663 | Exhibition: From Mud to Bloom |
| `seed-0604.jpg` | seed+-0604.jpg | 6048×4024 | 2500×1663 | Work: Untitled, Exhibition: From Mud to Bloom |
| `the-ring-of-compression.jpg` | The-Ring-of-Compression.jpg | 3010×2516 | 2500×2090 | Work: Breakaway |
| `unchangeable.jpg` | Unchangeable.JPG | 2627×3569 | 2500×3396 | Works index |
| `what-is-left-behind-0381.jpg` | what+is+left+behind--0381.jpg | 6048×4024 | 2500×1663 | Work: What is Left Behind?, Exhibition: From Mud to Bloom |
| `what-is-left-behind-0389.jpg` | what+is+left+behind--0389.jpg | 6048×4024 | 2500×1663 | Work: What is Left Behind?, Exhibition: From Mud to Bloom |
| `what-is-left-behind-0428.jpg` | what+is+left+behind--0428.jpg | 6048×4024 | 2500×1663 | Work: What is Left Behind? |
| `what-is-left-behind-0430.jpg` | what+is+left+behind--0430.jpg | 6048×4024 | 2500×1663 | Exhibition: From Mud to Bloom |
| `what-is-left-behind-0433.jpg` | what+is+left+behind--0433.jpg | 6048×4024 | 2500×1663 | Work: What is Left Behind?, Exhibition: From Mud to Bloom |
| `what-is-left-behind-0484.jpg` | what+is+left+behind--0484.jpg | 6048×4024 | 2500×1663 | Exhibition: From Mud to Bloom |
| `yoon-0ef162.jpg` | YOON.jpg | 4000×5739 | 2500×3587 | About |
| `yoon-lee-project-image-1.jpg` | Yoon+Lee_Project+Image_1.jpg | 3928×5159 | 2500×3283 | Work: Persona |
| `yoon-lee-project-image-2.jpg` | Yoon+Lee_Project+Image_2.jpg | 4284×5712 | 2500×3333 | Work: Persona |
| `yoon-lee-project-image-3.jpg` | Yoon+Lee_Project+Image_3.jpg | 4284×5712 | 2500×3333 | Works index, Work: Persona |
| `yoon-lee-project-image-4.jpg` | Yoon+Lee_Project+Image_4.jpg | 4284×5712 | 2500×3333 | Work: Persona |

## Images already at full size (46)

<details><summary>Show list</summary>

| Local file | Original filename | Size |
|---|---|---|
| `0a07a29b-eda7-4846-a544-c3f14de28f9d.png` | 0A07A29B-EDA7-4846-A544-C3F14DE28F9D.png | 1440×1800 |
| `1374a46c-3ea8-4357-a7cd-9d11eac1c999.jpg` | 1374A46C-3EA8-4357-A7CD-9D11EAC1C999.JPG | 1440×1800 |
| `1c62841d-62f1-483e-90a3-8c6487ef7c52.jpg` | 1C62841D-62F1-483E-90A3-8C6487EF7C52.JPG | 1440×1800 |
| `448905064-325235130630518-1388608426202550042-n.jpg` | 448905064_325235130630518_1388608426202550042_n.jpg | 1440×1733 |
| `450831140-1035095321571465-1770468227649311776-n.jpg` | 450831140_1035095321571465_1770468227649311776_n.jpg | 1440×1800 |
| `472890910-1010492967782606-2353419013385629839-n.jpg` | 472890910_1010492967782606_2353419013385629839_n.jpg | 1440×1800 |
| `5cc93b13-9a63-4f96-8d35-410bfdd88074.jpg` | 5CC93B13-9A63-4F96-8D35-410BFDD88074.JPG | 1440×1800 |
| `ae34ebdf-b89d-4fdd-85ac-9e019e2437a4.png` | AE34EBDF-B89D-4FDD-85AC-9E019E2437A4.png | 1440×1800 |
| `breath-5780-760adc.jpg` | breath-5780.jpg | 2500×3339 |
| `carring-blossom-11-176518.jpg` | carring+blossom-11.jpg | 2217×1663 |
| `cf6e5070-5fe4-4506-be5e-b99ff1704c17.png` | CF6E5070-5FE4-4506-BE5E-B99FF1704C17.png | 1440×1800 |
| `clay-chicken-black-background.png` | clay+chicken+black+background.png | 2037×1422 |
| `d900a470-ffe1-41f7-a71a-e353e4f46eee.png` | D900A470-FFE1-41F7-A71A-E353E4F46EEE.png | 1440×1800 |
| `dsc-3311-176518.jpg` | DSC_3311.jpg | 1915×2877 |
| `dsc-3311-177064.jpg` | DSC_3311.jpg | 2343×2632 |
| `dsc-3312-176518.jpg` | DSC_3312.jpg | 2043×3070 |
| `dsc-3312-177064.jpg` | DSC_3312.jpg | 2355×2802 |
| `dsc-4072-2.jpg` | DSC_4072+(2).jpg | 2500×1662 |
| `dsc-4072-282-29.jpg` | DSC_4072+%282%29.jpg | 2500×1663 |
| `dsc-4085.jpg` | DSC_4085.jpg | 2338×1555 |
| `dsc-4087.jpg` | DSC_4087.jpg | 2500×1662 |
| `dsc-9867.jpg` | DSC_9867.jpg | 2373×1578 |
| `dsc-9905-177961.jpg` | DSC_9905.jpg | 1899×1263 |
| `dsc-9930-bd5ed4.jpg` | DSC_9930.jpg | 2000×1331 |
| `eomma-0412.jpg` | 엄마-0412.jpg | 2500×3034 |
| `every-fall-we-make-rice-cakes-painting-2.jpg` | Every+Fall,+We+Make+Rice+Cakes_Painting+#2.jpg | 692×699 |
| `figure1.jpg` | figure1.jpg | 2268×3317 |
| `figure2.jpg` | figure2.jpg | 2117×2845 |
| `figure3.jpg` | figure3.jpg | 1942×2685 |
| `first-button.jpg` | First+Button.JPG | 2496×3365 |
| `la-landscape-png-copy.jpg` | LA+Landscape+png+copy.jpg | 1796×1224 |
| `mg-7149.jpg` | _MG_7149.jpg | 2000×1333 |
| `mg-7180.jpg` | _MG_7180.jpg | 2000×1333 |
| `mg-7248.jpg` | _MG_7248.jpg | 2000×1333 |
| `mg-7307.jpg` | _MG_7307.jpg | 2000×1333 |
| `mg-7337.jpg` | _MG_7337.jpg | 2000×1333 |
| `mg-7493-2.jpg` | _MG_7493-2.jpg | 1333×2000 |
| `mg-7506-2.jpg` | _MG_7506-2.jpg | 1333×2000 |
| `mg-7555.jpg` | _MG_7555.jpg | 1333×2000 |
| `mg-7592.jpg` | _MG_7592.jpg | 1333×2000 |
| `my-figures.png` | My+Figures.png | 1286×606 |
| `new-foil-chicken-copy.jpg` | new-foil-chicken+copy.jpg | 2008×2346 |
| `what-is-left-behind-0374.jpg` | what+is+left+behind--0374.jpg | 2420×1610 |
| `yoon-28.jpg` | YOON-28.JPG | 2048×1536 |
| `yoon-4.jpg` | YOON-4.JPG | 1497×1996 |
| `yoon-88cf61.jpg` | YOON.jpg | 2500×3586 |

</details>
