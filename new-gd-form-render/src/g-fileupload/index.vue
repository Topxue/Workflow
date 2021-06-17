<template>
  <g-form-item
    :decorator="dataInfo.rules"
    prop="value"
    :label="dataInfo.name"
    :required="dataInfo.options.required"
  >
    <el-upload
      :data="params"
      :action="action"
      :accept="accept"
      :headers="headers"
      :auto-upload="true"
      :file-list="fileList"
      :on-exceed="handleExceed"
      :on-remove="handleRemove"
      :on-success="handleUploadSuccess"
      :before-upload="handleBeforeUpload"
      :on-preview="handleDownloadFile"
      :limit="dataInfo.options.length"
      :multiple="dataInfo.options.multiple"
      :disabled="dataInfo.options.disabled || dataInfo.options.writeable === false"
    >
      <div class="el-upload el-upload--picture-card upload-trigger">
        <i slot="default" class="el-icon-plus"></i>
      </div>
    </el-upload>
  </g-form-item>
</template>

<script>
import { uploadConfig } from '../../utils/config'
import valueMixin from '../mixins/valueMixin'

const ERROR_OK = 10000

export default {
  name: 'gFileupload',
  mixins: [valueMixin],
  data() {
    return {
      fileIds: [],
      fileList: [],
      disabled: false,
      dialogImageUrl: '',
      uploadLength: null,
      dialogVisible: false,
      action: uploadConfig.action,
      params: uploadConfig.params,
      headers: uploadConfig.headers,
      // accept: '.doc, .docx, .pdf, .jpg, .png, .jpeg, .zip, .rar'
      accept: '.doc, .docx, .pdf, .zip, .rar'
    }
  },

  mounted() {
    this.uploadLength = this.dataInfo.options.length
    this.fileDataBackShow()
    this.fileImageUpload()
  },

  methods: {
    fileDataBackShow() {
      const fileData = this.dataInfo.value
      if (fileData && fileData.length) {
        this.fileList = fileData.map(item => {
          return {
            url: uploadConfig.getFileUrl(item.url),
            name: item.fileName
          }
        })

        this.fileIds = [...fileData]
      }
    },

    fileImageUpload() {
      const disabled = this.dataInfo.options.disabled || this.dataInfo.options.writeable === false

      if (disabled) {
        const uploadWarper = document.querySelector('.upload-trigger')
        if (uploadWarper) uploadWarper.style.display = 'none'
      }
    },

    handleDownloadFile(file) {
      let link = document.createElement('a')
      link.download = file.fileName
      link.style.display = 'none'
      link.href = file.url
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
    },

    handleRemove(file, fileList) {
      const fileIds = fileList.map(res => {
        if ('response' in res) {
          return {
            url: res.response.data.id,
            fileName: res.response.data.originalFilename
          }
        }
      })

      this.value = fileIds
      this.fileIds = fileIds
    },

    handleBeforeUpload(file) {
      const isLt30M = file.size / 1024 / 1024 < 30
      if (!isLt30M) {
        this.$message.error('上传文件大小不能超过 30MB!')
        return false
      }
    },

    // * 文件上传成功
    handleUploadSuccess(res) {
      if (res.code === ERROR_OK) {
        const { id, originalFilename } = res.data
        this.fileIds.push({
          url: id,
          fileName: originalFilename
        })
      }

      this.value = this.fileIds
    },

    handleExceed() {
      return this.$message.error(`文件数量限制最多${this.uploadLength}个！`)
    }
  }
}
</script>

<style lang="scss" scoped>
.upload-trigger {
  width: 50px;
  height: 50px;
  line-height: 50px;
}

/deep/.el-upload--picture-card i {
  font-size: 20px;
}
</style>
